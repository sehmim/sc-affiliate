import { fetchCampaignsData, fetchCampainDeals } from './impact'
import { ImpactCampaignData, NormalizedCampaign, NormalizedDeal, RawDeal } from './types'
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

// function campaignsAreEqual(
// 	a: NormalizedCampaign[],
// 	b: NormalizedCampaign[]
// ): boolean {
// 	if (a.length !== b.length) return false

// 	for (let i = 0; i < a.length; i++) {
// 		if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) return false
// 	}

// 	return true
// }

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
				const rawDeals = await fetchCampainDeals(campaign.CampaignId[0])
				// Filter out the deals that are expired or have no discount
				const hasActiveDeals =
					rawDeals?.ImpactRadiusResponse?.Deals[0]?.Deal?.some(
						(deal: any) =>
							deal.State[0] !== 'Expired' &&
							parseFloat(deal.DiscountPercent[0]) !== 0
					) || false

				// only return if it has active deals
				if (!hasActiveDeals) {
					return null
				}

				const activeDeals =
					rawDeals?.ImpactRadiusResponse?.Deals[0]?.Deal?.filter(
						(deal: any) =>
				            deal.State[0] !== 'Expired' &&
				            parseFloat(deal.DiscountPercent[0]) !== 0
					) || []

				const dealsToEnter: NormalizedDeal[] = activeDeals.map((deal: RawDeal) => { 
						const discount = deal.DiscountType[0] === 'FIXED' ? parseFloat(deal.DiscountAmount) || 0 : parseFloat(deal.DiscountPercent[0])
						
						if (discount === 0 || Number.isNaN(discount)) return null;

						return {
							discount: deal.DiscountType[0] === 'FIXED' ? `${discount} ${deal.DiscountCurrency}` : `${discount}%`
						}
					}).filter((item: any) => item !== null)

				if(dealsToEnter.length === 0) return null; 

				return {
					campaignID: campaign.CampaignId[0],
					advertiserName: campaign.AdvertiserName[0],
					campaignName: campaign.CampaignName[0],
					campaignLogoURI: `https://cdn2.impact.com/display-logo-via-campaign/${campaign.CampaignId[0]}.gif`,
					activeDate: new Date().toISOString(),
					insertionOrderStatus: campaign.ContractStatus[0],
					advertiserURL: campaign.AdvertiserUrl[0].startsWith('http://')
						? `https://${campaign.AdvertiserUrl[0].slice(7)}`
						: campaign.AdvertiserUrl[0],
					subDomains: campaign.DeeplinkDomains[0]?.DeeplinkDomain || [],
					deals: dealsToEnter,
					isActive: false,
				}
			})
		).then((campaigns) =>
			campaigns.filter(
				(campaign): campaign is NormalizedCampaign => campaign !== null
			)
		)

		const latestEntry = await getLatestCampaignEntryInDB();

        // Debugging statement - Julio
        console.log('Latest entry from DB:', JSON.stringify(latestEntry, null, 2));
        console.log('Newly fetched campaigns:', JSON.stringify(normalizedCampaigns, null, 2));

		// TODO: areEqual always returns false. Check if areCampaignsEqual is really working
		const areEqual = latestEntry && areCampaignsEqual(normalizedCampaigns, latestEntry)
        console.log('Are campaigns equal?', areEqual);

		if (areEqual) {
            console.log('Campaigns are equal, no update needed');
            return;
        }
          
        console.log('Campaigns are different, updating...');
		await populateCollectionWithCampaigns(normalizedCampaigns);

	} catch (error) {
		console.error('Error syncing Impact campaigns:', error)
	}
}

async function getLatestCampaignEntryInDB(): Promise<NormalizedCampaign[] | null> {
  try {
    // Query the latest entry by ordering by document creation time
    const snapshot = await db.collection("impactCampaignsSynced")
      .orderBy("__name__", "desc") // Order by document ID to get the latest one
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.log("No campaigns found.");
      return null;
    }

    // Extract the latest document data
    const latestDoc = snapshot.docs[0];
    const latestCampaigns = latestDoc.data().campaigns;

    return latestCampaigns;
  } catch (error) {
    console.error("Error fetching the latest impact campaigns:", error);
    throw new Error("Failed to fetch the latest impact campaigns.");
  }
}

async function populateCollectionWithCampaigns(campaignsArray: NormalizedCampaign[]) {
  try {
    const docRef = db.collection("impactCampaignsSynced").doc(); // Create a new document reference

    await docRef.set({
      campaigns: campaignsArray,
      createdAt: new Date().toISOString() // Add client-side timestamp
    });

    console.log("Successfully populated campaigns into impactCampaignsSynced collection.");
  } catch (error) {
    console.error("Error populating campaigns:", error);
    throw new Error("Failed to populate impact campaigns.");
  }
}

function areCampaignsEqual(
    array1: NormalizedCampaign[], 
    array2: NormalizedCampaign[]
  ): boolean {
    if (!Array.isArray(array1) || !Array.isArray(array2)) {
      console.log('One or both campaign arrays are not valid arrays');
      return false;
    }
  
    if (array1.length !== array2.length) {
      console.log(`Arrays have different lengths: ${array1.length} vs ${array2.length}`);
      return false;
    }
  
    const sortedArray1 = array1.slice().sort((a, b) => a.campaignID.localeCompare(b.campaignID));
    const sortedArray2 = array2.slice().sort((a, b) => a.campaignID.localeCompare(b.campaignID));
  
    for (let i = 0; i < sortedArray1.length; i++) {
      const campaign1 = sortedArray1[i];
      const campaign2 = sortedArray2[i];
  
      if (!campaign1 || !campaign2) {
        console.log(`Invalid campaign object at index ${i}`);
        return false;
      }
  
      if (
        campaign1.campaignID !== campaign2.campaignID ||
        campaign1.advertiserName !== campaign2.advertiserName ||
        campaign1.campaignName !== campaign2.campaignName ||
        campaign1.campaignLogoURI !== campaign2.campaignLogoURI ||
        campaign1.insertionOrderStatus !== campaign2.insertionOrderStatus ||
        campaign1.advertiserURL !== campaign2.advertiserURL ||
        campaign1.isActive !== campaign2.isActive ||
        !compareStringArrays(campaign1.subDomains, campaign2.subDomains) ||
        !compareDealsArray(campaign1.deals, campaign2.deals)
      ) {
        console.log(`Mismatch found in campaign ${campaign1.campaignID}`);
        return false;
      }
    }
  
    return true;
}
  

// Helper function to compare two arrays of strings
function compareStringArrays(array1: string[], array2: string[]): boolean {
  if (array1.length !== array2.length) {
    return false;
  }
  const sortedArray1 = array1.slice().sort();
  const sortedArray2 = array2.slice().sort();
  return sortedArray1.every((value, index) => value === sortedArray2[index]);
}

// Helper function to compare two arrays of NormalizedDeal objects
function compareDealsArray(array1: NormalizedDeal[], array2: NormalizedDeal[]): boolean {
    /**
     * @NOTE
     * I had to use ts.ignore and break your discountType here because for no reason it is saying that data was different 
     * even though in-fact we knew that the data was the exact same. This is where I had to make it spaghetti for now. 
     * - Julio
     */

    if (!Array.isArray(array1) || !Array.isArray(array2)) {
      console.log('One or both deal arrays are not valid arrays');
      return false;
    }
  
    if (array1.length !== array2.length) {
      console.log(`Deal arrays have different lengths: ${array1.length} vs ${array2.length}`);
      return false;
    }
  
    const sortedArray1 = array1.slice().sort((a, b) => {
        // // @ts-ignore
        // console.log('a.discount:', a.discount);
        // // @ts-ignore
        // console.log('b.discount:', b.discount);

         // @ts-ignore
        if (!a || !b || typeof a.discount !== 'string' || typeof b.discount !== 'string') {
            console.log('Invalid deal object found:', a, b);
            return 0;
        }
            // @ts-ignore
            return a.discount.localeCompare(b.discount);
        });
  
        const sortedArray2 = array2.slice().sort((a, b) => {
            // @ts-ignore
        if (!a || !b || typeof a.discount !== 'string' || typeof b.discount !== 'string') {
            console.log('Invalid deal object found:', a, b);
            return 0;
        }
                // @ts-ignore
        return a.discount.localeCompare(b.discount);
        });
  
        return sortedArray1.every((deal1, index) => {
        const deal2 = sortedArray2[index];
                // @ts-ignore
        if (!deal1 || !deal2 || typeof deal1.discount !== 'string' || typeof deal2.discount !== 'string') {
            console.log('Invalid deal comparison:', deal1, deal2);
            return false;
        }
                // @ts-ignore
        return deal1.discount === deal2.discount;
        });
  }


export { syncImpactCampaigns }
