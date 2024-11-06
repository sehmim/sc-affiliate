import { parseStringPromise } from 'xml2js';
import { Campaign, CampaignsProvider } from '../../controllers/campagins/Campaigns';
import { updateCampaignArray } from '../../utils/helper';
import { getLatestEntry } from '../../utils/firestoreWrapper';
const CID = '5908526';
const BASE_URL = "https://advertiser-lookup.api.cj.com/v2";
const API_KEY = '203jmtf336py654qrv8ms40ms6';

export interface CJAdvertiserLookupResponse {
    "cj-api": {
        advertisers: {
            '$': object,
            advertiser: CJAdvertiser[]
        }[]
    }
}

type CJAdvertiser = {
  "advertiser-id": string[];
  "account-status": string[];
  "seven-day-epc": string[];
  "three-month-epc": string[];
  "language": string[];
  "advertiser-name": string[];
  "program-url": string[];
  "relationship-status": string[];
  "mobile-tracking-certified": string[];
  "cookieless-tracking-enabled": string[];
  "network-rank": string[];
  "primary-category": {
    parent: string[];
    child: string[];
  }[];
  "performance-incentives": string[];
  actions: {
    action: {
      name: string[];
      type: string[];
      id: string[];
      commission: {
        default: string[] | MoneyCommision;
      }[];
    }[];
  }[];
  "link-types": {
    "link-type": string[];
  }[];
};

interface MoneyCommision {
    "_": string,
    "$": object
}


export async function fetchCJAdvertisers(): Promise<CJAdvertiserLookupResponse> {
  const apiUrl =  `${BASE_URL}/advertiser-lookup?requestor-cid=${CID}&advertiser-ids=joined`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/xml'
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const xmlData = await response.text();
    const data = await parseStringPromise(xmlData);

    return data;

  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error(`Error: ${JSON.stringify(error)}`);
  }
}

export const normalizeCJAdvertisers = (advertisers: CJAdvertiser[]): Campaign[] => {
    
    return advertisers.map((advertiser) => {
        const customProps = {
                subDomains: [],
                isFeatured: false, 
                terms: [{ 
                    title: 'Gift cards included',
                    details: "N",
            }]
        }

        const payout = advertiser.actions[0].action[0].commission[0].default;

        // NOTE: Ignoring deals that give money discount
        const defaultPayoutRate = checkIfStringArray(payout) ? (payout[0].slice(0, payout[0].length -1))+"" : 0+"";


        return ({
                advertiserURL: advertiser['program-url'][0],
                campaignName: advertiser['advertiser-name'][0],
                campaignID: advertiser['advertiser-id'][0],
                campaignLogoURI: '',
                defaultPayoutRate,
                provider: CampaignsProvider.CJ,
                isActive: !!advertiser['account-status'][0],
                ...customProps
            })
        }
    )

};

export const constructUpdatedCamapgins = async (incomeinCampagins: Campaign[]) => {
  const { campaigns: latestCJCampaigns }: { campaigns: Campaign[] } = await getLatestEntry('CJCampaigns');

  const updatedArray = updateCampaignArray(latestCJCampaigns, incomeinCampagins);

  return updatedArray;
}

function checkIfStringArray(input: unknown): input is string[] {
  return Array.isArray(input) && input.every(item => typeof item === 'string');
}

// export const normalizeCJProgrammes = (_commissionGroups: CommissionGroupResponse[], programmes: CJProgramme[]) => {
    
//     // const sortedCommissionGroupByAdvertiser = commissionGroups.sort((a, b) => a.advertiser - b.advertiser);
//     const sortedProgrammesByAdvertiser = programmes.sort((a, b) => a.id - b.id);


//     return sortedProgrammesByAdvertiser.map((promgram, index) => 
//         {
//             const subDomains = promgram.validDomains.map(d => (d.domain));

//             return ({
//                 subDomains,
//                 campaignName: promgram.name,
//                 campaignID: promgram.id,
//                 campaignLogoURI: promgram.logoUrl,
//                 defaultPayoutRate: '555',
//                 advertiserURL: promgram.displayUrl,
//                 provider: CampaignsProvider.CJ,
//                 isActive: false, // TODO: Get past state
//                 isFeatured: false, // TODO: Get past state
//                 terms: [{ // TODO: Get past state
//                     title: 'Gift cards included',
//                     details: "N",
//                 }]
//             })
//         }
//     )

// };


// export const generateCJLink = async (advertiserId: number, destinationUrl: string, parameters: any, shorten: boolean) => {
//   const publisherId = PUBLISHER_ID;  // Store your publisherId here
//   const accessToken = API_KEY;  // Store your CJ API access token here
//   const apiUrl = `https://api.CJ.com/publishers/${publisherId}/linkbuilder/generate`;

//   const payload = {
//     advertiserId,
//     destinationUrl,
//     parameters,
//     shorten
//   };

//   try {
//     const response = await fetch(apiUrl, {
//       method: 'POST',
//       headers: {
//         'accept': 'application/json',
//         'content-type': 'application/json',
//         'Authorization': `Bearer ${accessToken}`
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       throw new Error(`CJ API error: ${response.statusText}`);
//     }

//     const data = await response.json();
//     return data;

//   } catch (error) {
//     console.error('Error generating CJ deep link:', error);
//     throw error;
//   }
// };


// export const getCommissionGroups = async (advertiserId: number) => {
//   const apiUrl = `https://api.CJ.com/publishers/${PUBLISHER_ID}/commissiongroups?accessToken=${API_KEY}&advertiserId=${advertiserId}`;

//   try {
//     const response = await fetch(apiUrl);

//     if (!response.ok) {
//       throw new Error(`CJ API error: ${response.statusText}`);
//     }

//     const data = await response.json();
//     return data;

//   } catch (error) {
//     console.error('Error fetching commission groups:', error);
//     throw error;
//   }
// };
