import { Campaign, CampaignsProvider } from '../../controllers/campagins/Campaigns';
import { DEFAULT_TERMS_AND_CONDITIONS } from '../../utils/conts';
import { extractNumber } from '../../utils/helper';
import { convertXmlToJson } from '../../utils/xml2json';

const clientId: string = 'R8xXyh0OFFWR595XYbFDUKSrt2tlVM0E';
const clientSecret: string = 'SGH2O1HRrBh7uptFMlKt4ujHwkIJIspB';
const accountSID: string = '4141785';

let cachedAccessToken: string | null = null;
let tokenExpiryTime: number | null = null; 

export async function getAccessToken(): Promise<string> {
  const currentTime = Date.now();
  if (cachedAccessToken && tokenExpiryTime && currentTime < tokenExpiryTime) {
    console.log('Using cached access token');
    return cachedAccessToken;
  }

  const tokenKey = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await fetch('https://api.linksynergy.com/token', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `scope=${accountSID}`,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch access token: ${response.statusText}`);
    }

    const tokenData = await response.json();
    const { access_token, expires_in } = tokenData;

    cachedAccessToken = access_token;
    tokenExpiryTime = currentTime + expires_in * 1000; 

    return access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to get access token');
  }
}

export async function getMerchByAppStatus(accessToken: string): Promise<any> {
  const url = `https://api.linksynergy.com/linklocator/1.0/getMerchByAppStatus/approved`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch advertisers: ${response.statusText}`);
    }


    const data = await response.text();
    const jsonData = await convertXmlToJson(data);
    return jsonData['ns1:getMerchByAppStatusResponse']['ns1:return'];

  } catch (error) {
    console.error('Error calling Rakuten API:', error);
    throw error;
  }
}

export async function getRakutenAdvertiserById(accessToken: string,advertiserId: string): Promise<any> {
  const url = `https://api.linksynergy.com/v2/advertisers/${advertiserId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch advertisers: ${response.statusText}`);
    }

    return await response.json();

  } catch (error) {
    console.error('Error calling Rakuten API:', error);
    throw error;
  }
}


export function normalizeRakutenCampaigns(rakutenCampaignsObject: any, merchesByAppStatuses: object[]){

    let normalizedCampaigns: Campaign[] = [];

    rakutenCampaignsObject.map(({ advertiser }: any) => {
        merchesByAppStatuses.map((merch: any) => {
            if (merch["ns1:mid"] === advertiser.id+"") {
              const defaultPayoutRate = extractNumber(merch['ns1:offer']['ns1:commissionTerms']);
              
                if (defaultPayoutRate) {
                  normalizedCampaigns.push({
                    campaignID: advertiser.id + "",
                    campaignName: advertiser.name,
                    campaignLogoURI: advertiser.profiles.logoURL,
                    advertiserURL: advertiser.url,
                    defaultPayoutRate: defaultPayoutRate + "",
                    subDomains: [], // TODO: Get Deeplink domains,
                    isActive: true,
                    isFeatured: false,
                    terms: DEFAULT_TERMS_AND_CONDITIONS,
                    provider: CampaignsProvider.Rakuten
                  })
                }
            }
        })
    })
    



    return { campaigns: normalizedCampaigns }
}





export interface DeepLinkPayload {
  url: string;
  advertiser_id: number;
  u1: string;
}

interface TrackingLinkResponse {
  trackingLink: string,
  teamName: string,
  programId: string,
  appliedDate: Date
}


export async function generateDeepLink(accessToken: string, payload: DeepLinkPayload): Promise<TrackingLinkResponse> {
  const url = `https://api.linksynergy.com/v1/links/deep_links`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch advertisers: ${response.statusText}`);
    }

    const rawRespose = await response.json();
    const { advertiser } = rawRespose;

    return {
      trackingLink: advertiser.deep_link.deep_link_url,
      teamName: advertiser.deep_link.u1,
      programId: advertiser.id,
      appliedDate: new Date()
    }

  } catch (error) {
    console.error('Error calling Rakuten API:', error);
    throw error;
  }
}