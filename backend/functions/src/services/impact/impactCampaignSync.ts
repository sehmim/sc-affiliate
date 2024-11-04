import { Campaign, CampaignsProvider } from '../../controllers/campagins/Campaigns';
import { DEFAULT_TERMS_AND_CONDITIONS } from '../../utils/consts';
import { getLatestEntry } from '../../utils/firestoreWrapper';
import { updateCampaignArray } from '../../utils/helper';
import { ImpactCampaignData } from '../types';
import { fetchImpactCampaignsData, fetchContracts } from './impact'

export async function getNormalizedCampagins() {
	try {
		const campaignsData = await fetchImpactCampaignsData()
    const campaigns: ImpactCampaignData[] =
			campaignsData.ImpactRadiusResponse.Campaigns[0].Campaign.filter(
				(campaign: any) => campaign.ContractStatus[0] === 'Active'
			)

    const rawContracts = await fetchContracts();

    const activeContacts = rawContracts.ImpactRadiusResponse.Contracts[0].Contract.filter((contract: any) => contract.Status[0] === "ACTIVE")
    const normalizedContracts: any[] = [];
    
    activeContacts.forEach((rawContract: any) => {
      const defaultPayoutRate = rawContract.Terms[0].EventPayouts[0].EventPayout[0].DefaultPayoutRate;
      if (defaultPayoutRate && defaultPayoutRate?.length > 0) {
        normalizedContracts.push({
          CampaignId: rawContract.CampaignId[0],
          DefaultPayoutRate: defaultPayoutRate[0]
        })
      }
    })

    let normalizedCampaings: Campaign[] = [];

    normalizedContracts.forEach((contract: any) => {
      campaigns.forEach((campaign) => {

        if (campaign.CampaignId[0] === contract.CampaignId) {
          normalizedCampaings.push(
            {
              provider: CampaignsProvider.Impact,
              campaignID: campaign.CampaignId[0],
              campaignName: campaign.CampaignName[0],
              campaignLogoURI: `https://cdn2.impact.com/display-logo-via-campaign/${campaign.CampaignId[0]}.gif`,
              advertiserURL: campaign.AdvertiserUrl[0].startsWith('http://')
                ? `https://${campaign.AdvertiserUrl[0].slice(7)}`
                : campaign.AdvertiserUrl[0],
              subDomains: campaign.DeeplinkDomains[0]?.DeeplinkDomain || [],
              defaultPayoutRate: contract.DefaultPayoutRate,
              isActive: true,
              isFeatured: false,
              terms: DEFAULT_TERMS_AND_CONDITIONS
            }
          ) 
        }
      })
    })
    return normalizedCampaings;

	} catch (error) {
    throw new Error("Error in getNormalizedCampagins");
	}
}

export const constructUpdatedCamapgins = async (incomeinCampagins: Campaign[]) => {
  const { campaigns: latestImpactCampaigns }: { campaigns: Campaign[] } = await getLatestEntry('impactCampaignsSynced');

  const updatedArray = updateCampaignArray(latestImpactCampaigns, incomeinCampagins);

  return updatedArray;
}