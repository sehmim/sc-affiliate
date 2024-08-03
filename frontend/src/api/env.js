export const LOCAL_ENV = true;


export const createCharityEndpoint = LOCAL_ENV ? 'http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/createCharity' :  'https://us-central1-sponsorcircle-3f648.cloudfunctions.net/createCharity';
export const deleteCharityEndpoint = LOCAL_ENV ? 'http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/deleteCharity' : 'https://us-central1-sponsorcircle-3f648.cloudfunctions.net/deleteCharity';
export const updateCharityEndpoint = LOCAL_ENV ? 'http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/updateCharity' : 'https://us-central1-sponsorcircle-3f648.cloudfunctions.net/updateCharity';
export const getCampaigns = LOCAL_ENV ? 'http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getCampaigns' : 'https://us-central1-sponsorcircle-3f648.cloudfunctions.net/getCampaigns';
