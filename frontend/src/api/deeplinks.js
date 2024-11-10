// Coppied from apiCalls in extension 

import { POST } from "./ApiClient";
import { UrlApplyAwinDeepLink, UrlApplyCJDeepLink, UrlApplyImpactDeepLink, UrlApplyRakutenDeepLink } from "./env";

export async function applyImpactAffiliateLink(campaign, userSettings, hostName) {

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

export async function applyRakutenDeepLink(campaign, userSettings) {

  const trackingLink = await POST(UrlApplyRakutenDeepLink, {
    advertiserUrl: campaign.advertiserURL,
    advertiserId: Number(campaign.campaignID),
    teamName: userSettings.selectedCharityObject.organizationName
  });

  return trackingLink;
}

export async function applyCJDeepLink(campaign, userSettings) {

  const trackingLink = await POST(UrlApplyCJDeepLink, {
    advertiserUrl: campaign.advertiserURL,
    advertiserId: Number(campaign.campaignID),
    teamName: userSettings.selectedCharityObject.organizationName
  });

  return trackingLink;
}

export async function applyAwinDeepLink(campaign, userSettings) {

  const trackingLink = await POST(UrlApplyAwinDeepLink, {
    advertiserUrl: campaign.advertiserURL,
    advertiserId: Number(campaign.campaignID),
    teamName: userSettings.selectedCharityObject.organizationName
  });

  return trackingLink;
}