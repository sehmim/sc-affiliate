import { AllowedCampaign, UserSettings, Campaign } from '../types/types';
// import { collectAndSendBrowserInfoApiUrl, LOCAL_ENV, UrlApplyAwinDeepLink, UrlApplyRakutenDeepLink, urlGetSyncedCampaigns } from "../utils/env";
const {
  LOCAL_ENV,
  urlGetSyncedCampaigns,
  UrlApplyAwinDeepLink,
  collectAndSendBrowserInfoApiUrl,
  UrlApplyRakutenDeepLink,
  UrlApplyImpactDeepLink,
  UrlApplyCJDeepLink
} = require('../utils/env');

export async function POST(url: string, payload: any) {
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

export async function applyImpactAffiliateLink(campaign: Campaign, userSettings: UserSettings, hostName?: string) {

  let advertiserURL = hostName;

  if (!advertiserURL) {
    advertiserURL = campaign.advertiserURL;
  }

  const trackingLink = await POST(UrlApplyImpactDeepLink, {
    hostName: advertiserURL,
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

export async function applyCJDeepLink(campaign: any, userSettings: UserSettings) {

  const trackingLink = await POST(UrlApplyCJDeepLink, {
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