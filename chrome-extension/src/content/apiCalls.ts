import { AllowedCampaign, UserSettings } from "../types/types";
// import { collectAndSendBrowserInfoApiUrl, LOCAL_ENV, UrlApplyAwinDeepLink, UrlApplyRakutenDeepLink, urlGetSyncedCampaigns } from "../utils/env";
const {
  LOCAL_ENV,
  urlGetSyncedCampaigns,
  UrlApplyAwinDeepLink,
  collectAndSendBrowserInfoApiUrl,
  UrlApplyRakutenDeepLink,
  UrlApplyImpactDeepLink
} = require('../utils/env');

async function POST(url: string, payload: any) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the JSON response from the server
  } catch (error) {
    console.error('POST request failed:', error);
    return null; // Return null if the request fails
  }
}


export async function GET(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Propagate the error to the caller if needed
  }
}

////////////////////////////////////////////////////////////////////////////////
export async function fetchCampaigns() {
  return await GET(urlGetSyncedCampaigns);
}

// export async function applyImpactAffiliateLink(campaign: AllowedCampaign, userSettings: UserSettings){
//   const { selectedCharityObject, email } = userSettings;

//   if (!selectedCharityObject?.organizationName) {
//     throw new Error('No Charity Selected');
//   }

//   // NOTE: CampaignID is same as ProgramId;
//   const url = LOCAL_ENV ? `http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/applyTrackingLink?programId=${campaignID}&teamName=${selectedCharityObject.organizationName}&email=${email}` 
//       : `https://applytrackinglink-6n7me4jtka-uc.a.run.app?programId=${campaignID}&teamName=${selectedCharityObject.organizationName}&email=${email}`;

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const responseData = await response.json();
//     return responseData;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     throw error; // Propagate the error to the caller if needed
//   }
// }

export async function applyImpactAffiliateLink(hostName: string, campaign: AllowedCampaign, userSettings: UserSettings) {

  const trackingLink = await POST(UrlApplyImpactDeepLink, {
    hostName,
    campaign,
    userSettings
  });

  return trackingLink;
}

export async function applyRakutenDeepLink(campaign: any, userSettings: UserSettings) {

  const trackingLink = await POST(UrlApplyRakutenDeepLink, {
    advertiserUrl: campaign.advertiserURL,
    advertiserId: Number(campaign.campaignID),
    teamName: userSettings.selectedCharityObject.organizationName
  });

  return trackingLink;
}

export async function applyAwinDeepLink(campaign: any, userSettings: UserSettings) {

  const trackingLink = await POST(UrlApplyAwinDeepLink, {
    advertiserUrl: campaign.advertiserURL,
    advertiserId: Number(campaign.campaignID),
    teamName: userSettings.selectedCharityObject.organizationName
  });

  return trackingLink;
}

export async function collectAndSendBrowserInfo() {
  // Collect browser information
  const browserInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    appVersion: navigator.appVersion,
    extensionVersion: chrome.runtime.getManifest().version,
  };

  try {
    // Send the collected info to the server
    const response = await fetch(collectAndSendBrowserInfoApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(browserInfo),
    });

    if (response.ok) {
      console.log('Browser info sent successfully');
    } else {
      console.error('Failed to send browser info', response.status);
    }
  } catch (error) {
    console.error('Error sending browser info:', error);
  }
}