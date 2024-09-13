import * as functions from 'firebase-functions';
import { convertXmlToJson } from '../../utils/xml2json';
import { db } from '../..';

const clientId: string = 'R8xXyh0OFFWR595XYbFDUKSrt2tlVM0E';
const clientSecret: string = 'SGH2O1HRrBh7uptFMlKt4ujHwkIJIspB';
const accountSID: string = '4141785';

let cachedAccessToken: string | null = null;
let tokenExpiryTime: number | null = null; 

async function getAccessToken(): Promise<string> {
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

async function getMerchByAppStatus(accessToken: string): Promise<any> {
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

async function getRakutenAdvertiserById(accessToken: string,advertiserId: string): Promise<any> {
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

// Advertisers
export const getRakutenCampagins = functions.https.onRequest(async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    const merchesByAppStatuses = await getMerchByAppStatus(accessToken);

    const rakutenCampaignPromises = merchesByAppStatuses.map((_merch: any, index: number) => {
        return getRakutenAdvertiserById(accessToken, merchesByAppStatuses[index]["ns1:mid"]);
    })

    const rakutenCampaignsObject = await Promise.all(rakutenCampaignPromises); 

    const normalizedRakutenCampaigns = normalizeRakutenCampaigns(rakutenCampaignsObject, merchesByAppStatuses);
    await storeData('rakutenCampaigns', normalizedRakutenCampaigns);

    res.status(200).json(normalizedRakutenCampaigns);
  } catch (error) {
    console.error('Error fetching advertisers:', error);
    res.status(500).send('Failed to fetch advertisers');
  }
});

function normalizeRakutenCampaigns(rakutenCampaignsObject: any, merchesByAppStatuses: object[]){

    let normalizedCampaigns: any[] = [];

    rakutenCampaignsObject.map(({ advertiser }: any) => {
        merchesByAppStatuses.map((merch: any) => {
            if (merch["ns1:mid"] === advertiser.id+"") {
                normalizedCampaigns.push({
                    campaignName: advertiser.name,
                    campaignLogoURI: advertiser.profiles.logoURL,
                    advertiserURL: advertiser.url,
                    defaultPayoutRate: merch['ns1:offer']['ns1:commissionTerms'], // TODO: Strip payoutrate from sentence;
                    subDomains: [] // TODO: Get Deeplink domains
                })
            }
        })
    })
    



    return { normalizedCampaigns }
}

export async function storeData(
  collectionName: string,
  inputData: Record<string, any>
): Promise<string> {
  try {
    // Add the data to the specified Firestore collection
    const docRef = await db.collection(collectionName).add(inputData);
    // Return the document ID
    return docRef.id;
  } catch (error) {
    console.error('Error writing to Firestore:', error);
    throw new Error('Failed to store data in Firestore');
  }
}