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
		console.log(campaignsData)
		console.log('ImpactRadiusResponse', campaignsData.ImpactRadiusResponse)
		console.log('Campaigns', campaignsData.ImpactRadiusResponse.Campaigns)

		if (
			!campaignsData ||
			!campaignsData.ImpactRadiusResponse ||
			!campaignsData.ImpactRadiusResponse.Campaigns
		) {
			throw new Error('No campaigns data found')
		}

		const campaigns: ImpactCampaignData[] =
			campaignsData.ImpactRadiusResponse.Campaigns[0].Campaign
		console.log('Campaigns', campaigns)

		// Normalize the campaigns data
		const normalizedCampaigns: NormalizedCampaign[] = await Promise.all(
			campaigns.map(async (campaign) => {
				const deals = await fetchCampainDeals(campaign.CampaignId[0])
				const activeDeals =
					deals?.ImpactRadiusResponse?.Deals[0]?.Deal?.filter(
						(deal: any) => deal.State[0] !== 'EXPIRED'
					) || []

				return {
					campaignID: campaign.CampaignId[0],
					advertiserName: campaign.AdvertiserName[0],
					campaignName: campaign.CampaignName[0],
					campaignLogoURI: `https://cdn2.impact.com${campaign.CampaignLogoUri[0]}`,
					activeDate: new Date().toISOString(), // Ask for clarification if I need to adjust this
					insertionOrderStatus: campaign.ContractStatus[0],
					payout: '', // Definitely need to extract this from the deals
					discountPercentage: 0, // Have to extract this one as well
					discountType: '', // for sure this one too - Leaving this for now as is for testing.
					advertiserURL: campaign.AdvertiserUrl[0].startsWith('http://')
						? `https://${campaign.AdvertiserUrl[0].slice(7)}`
						: campaign.AdvertiserUrl[0],
					subDomains: campaign.DeeplinkDomains[0]?.DeeplinkDomain || [],
					deals: activeDeals.map((deal: any) => ({
						discountType: deal.DiscountType[0],
						discountPercentage: parseFloat(deal.DiscountPercent[0]) || 0,
					})),
				}
			})
		)

		const batch = db.batch()
		const campaignsCollection = db.collection('ImpactCampaignsSynced')

		// normalize the campaigns data and save it to Firestore
		normalizedCampaigns.forEach((campaign) => {
			const docRef = campaignsCollection.doc(campaign.campaignID)
			batch.set(docRef, campaign, { merge: true })
		})

		await batch.commit()

		console.log(`Synced ${normalizedCampaigns.length} campaigns`)
	} catch (error) {
		console.error('Error syncing Impact campaigns:', error)
	}
}

export { syncImpactCampaigns }
