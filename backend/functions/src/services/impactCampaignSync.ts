import { fetchCampaignsData, fetchContracts } from './impact'
import { ImpactCampaignData, NormalizedCampaign } from './types';
import { db } from '..'

async function syncImpactCampaigns() {
	try {
		const campaignsData = await fetchCampaignsData()
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

    let normalizedCampaings: NormalizedCampaign[] = [];

    normalizedContracts.forEach((contract: any) => {
      campaigns.forEach((campaign) => {

        if (campaign.CampaignId[0] === contract.CampaignId) {
          normalizedCampaings.push(
            {
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
              defaultPayoutRate: contract.DefaultPayoutRate,
              isActive: false,
            }
          ) 
        }
      })
    })

		const latestEntry = await getLatestCampaignEntryInDB();

		// // TODO: areEqual always returns false. Check if areCampaignsEqual is really working
		const areEqual = latestEntry && areCampaignsEqual(normalizedCampaings, latestEntry)
    console.log('Are campaigns equal?', areEqual);

		if (areEqual) {
      console.log('Campaigns are equal, no update needed');
      return;
    }
          
    console.log('Campaigns are different, updating...');
		await populateCollectionWithCampaigns(normalizedCampaings);

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
      createdAt: new Date().toISOString()
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
        campaign1.defaultPayoutRate !== campaign2.defaultPayoutRate ||
        !compareStringArrays(campaign1.subDomains, campaign2.subDomains)
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
// function compareDealsArray(array1: NormalizedDeal[], array2: NormalizedDeal[]): boolean {
//     /**
//      * @NOTE
//      * I had to use ts.ignore and break your discountType here because for no reason it is saying that data was different 
//      * even though in-fact we knew that the data was the exact same. This is where I had to make it spaghetti for now. 
//      * - Julio
//      */

//     if (!Array.isArray(array1) || !Array.isArray(array2)) {
//       console.log('One or both deal arrays are not valid arrays');
//       return false;
//     }
  
//     if (array1.length !== array2.length) {
//       console.log(`Deal arrays have different lengths: ${array1.length} vs ${array2.length}`);
//       return false;
//     }
  
//     const sortedArray1 = array1.slice().sort((a, b) => {
//         // // @ts-ignore
//         // console.log('a.discount:', a.discount);
//         // // @ts-ignore
//         // console.log('b.discount:', b.discount);

//          // @ts-ignore
//         if (!a || !b || typeof a.discount !== 'string' || typeof b.discount !== 'string') {
//             console.log('Invalid deal object found:', a, b);
//             return 0;
//         }
//             // @ts-ignore
//             return a.discount.localeCompare(b.discount);
//         });
  
//         const sortedArray2 = array2.slice().sort((a, b) => {
//             // @ts-ignore
//         if (!a || !b || typeof a.discount !== 'string' || typeof b.discount !== 'string') {
//             console.log('Invalid deal object found:', a, b);
//             return 0;
//         }
//                 // @ts-ignore
//         return a.discount.localeCompare(b.discount);
//         });
  
//         return sortedArray1.every((deal1, index) => {
//         const deal2 = sortedArray2[index];
//                 // @ts-ignore
//         if (!deal1 || !deal2 || typeof deal1.discount !== 'string' || typeof deal2.discount !== 'string') {
//             console.log('Invalid deal comparison:', deal1, deal2);
//             return false;
//         }
//                 // @ts-ignore
//         return deal1.discount === deal2.discount;
//         });
//   }


export { syncImpactCampaigns }