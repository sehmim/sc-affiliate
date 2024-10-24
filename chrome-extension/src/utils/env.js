const LOCAL_ENV = true;

const urlGetSyncedCampaigns = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getSyncedCampaigns" : "https://us-central1-sponsorcircle-3f648.cloudfunctions.net/getSyncedCampaigns"; 
const collectAndSendBrowserInfoApiUrl = LOCAL_ENV ? 'http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/collectAndSendBrowserInfo' : 'https://collectandsendbrowserinfo-6n7me4jtka-uc.a.run.app';
const UrlApplyRakutenDeepLink = LOCAL_ENV ? 'http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/applyRakutenDeepLink' : 'https://us-central1-sponsorcircle-3f648.cloudfunctions.net/applyRakutenDeepLink';
const UrlApplyAwinDeepLink = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/applyAwinDeepLink" : "https://us-central1-sponsorcircle-3f648.cloudfunctions.net/applyAwinDeepLink";
const UrlApplyImpactDeepLink = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/applyTrackingLink" : "https://applytrackinglink-6n7me4jtka-uc.a.run.app";

module.exports = { 
    LOCAL_ENV, 
    urlGetSyncedCampaigns, 
    UrlApplyAwinDeepLink, 
    collectAndSendBrowserInfoApiUrl,
    UrlApplyRakutenDeepLink,
    UrlApplyImpactDeepLink
}

