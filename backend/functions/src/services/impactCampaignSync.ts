// import * as admin from 'firebase-admin'
import { fetchCampaignsData, fetchCampainDeals } from './impact'
import { ImpactCampaignData, NormalizedCampaign } from './types'
import { db } from '..';


// if (!admin.apps.length) {
// 	admin.initializeApp()
// }

// const db = admin.firestore()

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
                    isActive: false
				}
			})
		).then((campaigns) => campaigns.filter((campaign): campaign is NormalizedCampaign => campaign !== null))

		const batch = db.batch()
        const syncedCollection = db.collection('impactCampaignsSynced')

        /**
         * @BUG
         * There may have been a bug here as it is not creating the old collection database.
         */
        const oldCollection = db.collection('impactCampaignsOld')

        // Get all existing campaigns
        const existingCampaigns = await syncedCollection.get()

        // Creating new set of new campaign IDs for quick lookup as per mentioned
        /**
         * @BUG 
         * There may be a bug here it is creating new campaign IDs but not using it to compare with existing campaigns...?
         */
        const newCampaignIDs = new Set(normalizedCampaigns.map(c => c.campaignID))
        // console.log("New Campaign IDs", newCampaignIDs)

        // Process Existing campaigns
        existingCampaigns.forEach(doc => {
            const campaignData = doc.data() as NormalizedCampaign
            if (!newCampaignIDs.has(campaignData.campaignID)) {
                // Move to old collection if not in new set
                console.log("Moving to old collection", campaignData.campaignID)
                batch.set(oldCollection.doc(doc.id), campaignData)
                batch.delete(syncedCollection.doc(doc.id))
            }
        })

        // Process new and updated campaigns
        for (const campaign of normalizedCampaigns) {
            const docRef = syncedCollection.doc(campaign.campaignID)
            const existingDoc = await docRef.get()

            if (existingDoc.exists) {
                // console.log("Updating existing campaign", campaign.campaignID)
                const existingData = existingDoc.data() as NormalizedCampaign
                campaign.isActive = existingData.isActive // Preserve existing isActive status
                batch.set(docRef, campaign, { merge: true })
            } else {
                batch.set(docRef, campaign)
            }
        }

		// const campaignsCollection = db.collection('impactCampaignsSynced')

		// normalize the campaigns data and save it to Firestore
		// normalizedCampaigns.forEach((campaign) => {
		// 	const docRef = campaignsCollection.doc(campaign.campaignID)
		// 	batch.set(docRef, campaign, { merge: true })
		// })

		await batch.commit()

		// console.log(`Synced ${normalizedCampaigns.length} campaigns`)
	} catch (error) {
		console.error('Error syncing Impact campaigns:', error)
	}
}

export { syncImpactCampaigns }
