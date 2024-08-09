// import * as admin from 'firebase-admin'
import { fetchCampaignsData, fetchCampainDeals } from './impact'
import { ImpactCampaignData, NormalizedCampaign } from './types'
import { db } from '..'

// if (!admin.apps.length) {
// 	admin.initializeApp()
// }

// const db = admin.firestore()

/**
 * @TODO Clean up commented code, and also let Sehmim review the code
 */

/**
 * @KEYCHANGES
 * 1) Added campaignsAreEqual function to check if the campaigns are equal. This func compares two arrays of normalized campaigns (As per the discussion on discord)
 * 
 * 2) syncImpactCampaigns function, after fetching and normalizing the campaigns from the impact api,
 * 
 * 3) the check is done with the condition in line line 130. This condition if true:
 *  - There are no previous syncs or the new campaigns are different from the most recent sync.
 * 
 * 4) If the condition is true, the new sync object is created and added to the beginning of the array of sync objects.
 * 
 * 5) if condition is false campaign is not the same we just log a message. I don't really know what you want to do here.
 */

/**
 * @TODO
 * Check for campaigns if equal compare two arrays of normalized campaign
 * a.campaignID === b.campaignID
 */

function campaignsAreEqual(
	a: NormalizedCampaign[],
	b: NormalizedCampaign[]
): boolean {
	if (a.length !== b.length) return false

	for (let i = 0; i < a.length; i++) {
		if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) return false
	}

	return true
}

async function syncImpactCampaigns() {
	try {
		// Fetch campaigns data from Impact API
		const campaignsData = await fetchCampaignsData()

		// console.logs for debugging
		// console.log(campaignsData)
		// console.log('ImpactRadiusResponse', campaignsData.ImpactRadiusResponse)
		// console.log('Campaigns', campaignsData.ImpactRadiusResponse.Campaigns)

		if (
			!campaignsData ||
			!campaignsData.ImpactRadiusResponse ||
			!campaignsData.ImpactRadiusResponse.Campaigns
		) {
			throw new Error('No campaigns data found')
		}

		// Filter out the campaigns that are not active
		const campaigns: ImpactCampaignData[] =
			campaignsData.ImpactRadiusResponse.Campaigns[0].Campaign.filter(
				(campaign: any) => campaign.ContractStatus[0] === 'Active'
			)
		// console.log('Campaigns', campaigns)

		// Normalize the campaigns data
		const normalizedCampaigns: NormalizedCampaign[] = await Promise.all(
			campaigns.map(async (campaign) => {
				const deals = await fetchCampainDeals(campaign.CampaignId[0])
				// Filter out the deals that are expired or have no discount
				// const activeDeals =
				// 	deals?.ImpactRadiusResponse?.Deals[0]?.Deal?.filter(
				// 		(deal: any) =>
				//             deal.State[0] !== 'Expired' &&
				//             parseFloat(deal.DiscountPercent[0]) !== 0
				// 	) || []
				const hasActiveDeals =
					deals?.ImpactRadiusResponse?.Deals[0]?.Deal?.some(
						(deal: any) =>
							deal.State[0] !== 'Expired' &&
							parseFloat(deal.DiscountPercent[0]) !== 0
					) || false

				// only return if it has active deals
				if (!hasActiveDeals) {
					return null
				}

				return {
					campaignID: campaign.CampaignId[0],
					advertiserName: campaign.AdvertiserName[0],
					campaignName: campaign.CampaignName[0],
					campaignLogoURI: `https://cdn2.impact.com${campaign.CampaignLogoUri[0]}`,
					activeDate: new Date().toISOString(), // Ask for clarification if I need to adjust this
					insertionOrderStatus: campaign.ContractStatus[0],
					// payout: '', // Definitely need to extract this from the deals
					// discountPercentage: 0, // Have to extract this one as well
					// discountType: '', // for sure this one too - Leaving this for now as is for testing.
					advertiserURL: campaign.AdvertiserUrl[0].startsWith('http://')
						? `https://${campaign.AdvertiserUrl[0].slice(7)}`
						: campaign.AdvertiserUrl[0],
					subDomains: campaign.DeeplinkDomains[0]?.DeeplinkDomain || [],
					// deals: activeDeals.map((deal: any) => ({
					// 	discountType: deal.DiscountType[0],
					// 	discountPercentage: parseFloat(deal.DiscountPercent[0]) || 0,
					// })),
					isActive: false,
				}
			})
		).then((campaigns) =>
			campaigns.filter(
				(campaign): campaign is NormalizedCampaign => campaign !== null
			)
		)

		const syncedCollection = db.collection('impactCampaignsSynced')
		const syncDocRef = syncedCollection.doc('campaigns')

		// get the current document
		const syncDoc = await syncDocRef.get()

		let currentSyncs = []
		if (syncDoc.exists) {
			currentSyncs = syncDoc.data()?.campaigns || []
		}

		// check if the new campaigns are different from the most recent sync
		if (
			currentSyncs.length === 0 ||
			!campaignsAreEqual(normalizedCampaigns, currentSyncs[0].campaigns)
		) {
			// create sync object
			const newSync = {
				timestamp: new Date().toISOString(),
				campaigns: normalizedCampaigns,
			}
			// console.log('New Sync:', newSync)

			// add the new sync object to the beginning of the array as per discussed on discord
			currentSyncs.unshift(newSync)

			// Update the document with the new array of sync objects
			await syncDocRef.set({
				syncs: currentSyncs,
				lastUpdated: new Date().toISOString(),
			})

			console.log(`Synced ${normalizedCampaigns.length} campaigns`)
		} else {
            console.log('No changes in campaigns, sync is skipped')
        }

		// const batch = db.batch()
		// const syncedCollection = db.collection('impactCampaignsSynced')

		// /**
		//  * @BUG
		//  * There may have been a bug here as it is not creating the old collection database.
		//  */
		// const oldCollection = db.collection('impactCampaignsOld')
		// console.log("Old Collection", oldCollection)

		// // Get all existing campaigns
		// const existingCampaigns = await syncedCollection.get()

		// // Creating new set of new campaign IDs for quick lookup as per mentioned
		// /**
		//  * @BUG
		//  * There may be a bug here it is creating new campaign IDs but not using it to compare with existing campaigns...?
		//  */
		// const newCampaignIDs = new Set(normalizedCampaigns.map(c => c.campaignID))
		// // console.log("New Campaign IDs", newCampaignIDs)

		// // Process Existing campaigns
		// existingCampaigns.forEach(doc => {
		//     const campaignData = doc.data() as NormalizedCampaign
		//     if (!newCampaignIDs.has(campaignData.campaignID)) {
		//         // Move to old collection if not in new set
		//         console.log("Moving to old collection", campaignData.campaignID)
		//         batch.set(oldCollection.doc(doc.id), campaignData)
		//         batch.delete(syncedCollection.doc(doc.id))
		//     }
		// })

		// // Process new and updated campaigns
		// for (const campaign of normalizedCampaigns) {
		//     const docRef = syncedCollection.doc(campaign.campaignID)
		//     const existingDoc = await docRef.get()

		//     if (existingDoc.exists) {
		//         // console.log("Updating existing campaign", campaign.campaignID)
		//         const existingData = existingDoc.data() as NormalizedCampaign
		//         campaign.isActive = existingData.isActive // Preserve existing isActive status
		//         batch.set(docRef, campaign, { merge: true })
		//     } else {
		//         batch.set(docRef, campaign)
		//     }
		// }

		// // const campaignsCollection = db.collection('impactCampaignsSynced')

		// // normalize the campaigns data and save it to Firestore
		// // normalizedCampaigns.forEach((campaign) => {
		// // 	const docRef = campaignsCollection.doc(campaign.campaignID)
		// // 	batch.set(docRef, campaign, { merge: true })
		// // })

		// await batch.commit()

		// console.log(`Synced ${normalizedCampaigns.length} campaigns`)
	} catch (error) {
		console.error('Error syncing Impact campaigns:', error)
	}
}

export { syncImpactCampaigns }
