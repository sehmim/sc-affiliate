import { parseStringPromise } from 'xml2js';
import { ensureHttps } from '../../utils/helper';

const IMPACT_BASE_URL = 'https://api.impact.com';
const IMPACT_API_USERNAME = 'IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1';
const IMPACT_API_PASSWORD = 'kYSeQ-vzgstPBUan9YZqWzCwRpkD~h7Y';


export const fetchImpactCampaignsData = async () => {
  try {
    const base64Auth = Buffer.from(
      `${IMPACT_API_USERNAME}:${IMPACT_API_PASSWORD}`
    ).toString("base64");

    const response = await fetch(
      `${IMPACT_BASE_URL}/Mediapartners/${IMPACT_API_USERNAME}/Campaigns`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${base64Auth}`,
          "Content-Type": "application/xml",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const xmlData = await response.text();
    
    const data = await parseStringPromise(xmlData);

    return data;

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchContracts = async () => {
    try {
    const base64Auth = Buffer.from(
      `${IMPACT_API_USERNAME}:${IMPACT_API_PASSWORD}`
    ).toString("base64");

    const response = await fetch(
      `${IMPACT_BASE_URL}/Mediapartners/${IMPACT_API_USERNAME}/Contracts`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${base64Auth}`,
          "Content-Type": "application/xml",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const xmlData = await response.text();
    
    const data = await parseStringPromise(xmlData);

    return data;

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export const fetchCampainDeals = async (campaignId: string) => {
    try {
    const base64Auth = Buffer.from(
      `${IMPACT_API_USERNAME}:${IMPACT_API_PASSWORD}`
    ).toString("base64");

    const response = await fetch(
      `${IMPACT_BASE_URL}/Mediapartners/${IMPACT_API_USERNAME}/Campaigns/${campaignId}/Deals`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${base64Auth}`,
          "Content-Type": "application/xml",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const xmlData = await response.text();
    
    const data = await parseStringPromise(xmlData);

    return data;

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


export async function generateLink(programId: string, teamName: string, email: string, deepLink?: string | null) {
  try {
    const base64Auth = Buffer.from(
      `${IMPACT_API_USERNAME}:${IMPACT_API_PASSWORD}`
    ).toString("base64");

    const deepLinkQuery = deepLink ? `&DeepLink=${deepLink}` : '';

    const url = `${IMPACT_BASE_URL}/Mediapartners/${IMPACT_API_USERNAME}/Programs/${programId}/TrackingLinks?Type=vanity&subId1=${teamName}&subId2=${email}${deepLinkQuery}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64Auth}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error making POST request:", error);
  }
}



export function getDeepLink(hostname: string, deepLinks: string[]) {
  // Normalize the hostname by removing 'www.' if it exists
  const normalizedHostname = hostname.startsWith('www.') ? hostname.slice(4) : hostname;

  // Check each deep link
  for (const deepLink of deepLinks) {
    // Remove the wildcard from the deep link for comparison
    const normalizedDeepLink = deepLink.replace(/\*/g, '').trim();
    
    // Check if the deep link contains a wildcard
    if (deepLink.includes('*')) {
      // Check if the hostname matches the deep link pattern
      const regexPattern = new RegExp(`^${normalizedDeepLink.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`);
      if (regexPattern.test(normalizedHostname)) {
        return ensureHttps(deepLink); // Return the matching deep link
      }
    } else {
      // Check for exact match
      if (normalizedHostname === deepLink) {
        return ensureHttps(deepLink); // Return the matching deep link
      }
    }
  }

  return null;
}