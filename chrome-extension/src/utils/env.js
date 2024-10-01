const LOCAL_ENV = false;

const urlGetSyncedCampaigns = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getSyncedCampaigns" : "https://us-central1-sponsorcircle-3f648.cloudfunctions.net/getSyncedCampaigns"; 


module.exports = { LOCAL_ENV, urlGetSyncedCampaigns }