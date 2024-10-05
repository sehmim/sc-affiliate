export const LOCAL_ENV = true;

export const urlGetSyncedCampaigns = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getSyncedCampaigns" : "https://us-central1-sponsorcircle-3f648.cloudfunctions.net/getSyncedCampaigns"; 

export const UrlApplyAwinDeepLink = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/applyAwinDeepLink" : "https://us-central1-sponsorcircle-3f648.cloudfunctions.net/applyAwinDeepLink";
export const collectAndSendBrowserInfoApiUrl = LOCAL_ENV ? 'http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/collectAndSendBrowserInfo' : 'https://collectandsendbrowserinfo-6n7me4jtka-uc.a.run.app';
export const UrlApplyRakutenDeepLink = LOCAL_ENV ? 'http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/applyRakutenDeepLink' : 'https://us-central1-sponsorcircle-3f648.cloudfunctions.net/applyRakutenDeepLink';

