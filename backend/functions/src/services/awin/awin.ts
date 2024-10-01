import { CampaignsProvider } from '../../controllers/campagins/Campaigns';
const API_KEY = 'b29b288d-5898-4a10-b93f-e588cf0a2678';
const PUBLISHER_ID = '1726335';

export interface AwinProgramme {
  description: string;
  clickThroughUrl: string;
  displayUrl: string;
  logoUrl: string;
  id: number;
  name: string;
  currencyCode: string;
  primaryRegion: {
    name: string;
    countryCode: string;
  };
  status: string;
  primarySector: string;
  validDomains: Array<{
    domain: string;
  }>;
}

export type CommissionGroup = {
    groupId: number;
    groupCode: string;
    groupName: string;
    type: string;
    amount: number;
    currency: string;
};

type CommissionGroupResponse = {
    advertiser: number;
    publisher: number;
    commissionGroups: CommissionGroup[];
};


export async function fetchAwinProgrammes(): Promise<AwinProgramme[] | null> {
  const apiUrl =   `https://api.awin.com/publishers/${PUBLISHER_ID}/programmes?accessToken=${API_KEY}&relationship=joined`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data: AwinProgramme[] = await response.json();
    return data;

  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}


export const generateAwinLink = async (advertiserId: number, destinationUrl: string, parameters: any, shorten: boolean) => {
  const publisherId = PUBLISHER_ID;  // Store your publisherId here
  const accessToken = API_KEY;  // Store your Awin API access token here
  const apiUrl = `https://api.awin.com/publishers/${publisherId}/linkbuilder/generate`;

  const payload = {
    advertiserId,
    destinationUrl,
    parameters,
    shorten
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Awin API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error generating Awin deep link:', error);
    throw error;
  }
};


export const getCommissionGroups = async (advertiserId: number) => {
  const apiUrl = `https://api.awin.com/publishers/${PUBLISHER_ID}/commissiongroups?accessToken=${API_KEY}&advertiserId=${advertiserId}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Awin API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching commission groups:', error);
    throw error;
  }
};



export const normalizeAwinProgrammes = (_commissionGroups: CommissionGroupResponse[], programmes: AwinProgramme[]) => {
    
    // const sortedCommissionGroupByAdvertiser = commissionGroups.sort((a, b) => a.advertiser - b.advertiser);
    const sortedProgrammesByAdvertiser = programmes.sort((a, b) => a.id - b.id);


    return sortedProgrammesByAdvertiser.map((promgram, index) => 
        {
            const subDomains = promgram.validDomains.map(d => (d.domain));

            return ({
                subDomains,
                campaignName: promgram.name,
                campaignID: promgram.id,
                campaignLogoURI: promgram.logoUrl,
                defaultPayoutRate: '555',
                advertiserURL: promgram.displayUrl,
                provider: CampaignsProvider.Awin,
                isActive: false, // TODO: Get past state
                isFeatured: false, // TODO: Get past state
                terms: [{ // TODO: Get past state
                    title: 'Gift cards included',
                    details: "N",
                }]
            })
        }
    )

};