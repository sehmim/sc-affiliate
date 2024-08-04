export const LOCAL_ENV = false;


export const createCharityEndpoint = LOCAL_ENV ? 'http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/createCharity' :  'https://us-central1-sponsorcircle-3f648.cloudfunctions.net/createCharity';
export const deleteCharityEndpoint = LOCAL_ENV ? 'http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/deleteCharity' : 'https://us-central1-sponsorcircle-3f648.cloudfunctions.net/deleteCharity';
export const updateCharityEndpoint = LOCAL_ENV ? 'http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/updateCharity' : 'https://us-central1-sponsorcircle-3f648.cloudfunctions.net/updateCharity';
export const getCampaigns = LOCAL_ENV ? 'http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getCampaigns' : 'https://us-central1-sponsorcircle-3f648.cloudfunctions.net/getCampaigns';


export const sendVerificationCodeUrl = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/sendVerificationCode" : "https://sendverificationcode-6n7me4jtka-uc.a.run.app";
export const verifyVerificationCode = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/verifyVerificationCode" : "https://verifyverificationcode-6n7me4jtka-uc.a.run.app";
export const createUserUrl = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/createUser" : "https://createuser-6n7me4jtka-uc.a.run.app";
export const getUserByEmailUrl = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getUser" : "https://getuser-6n7me4jtka-uc.a.run.app";
export const updateUserUrl = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/updateUser": "https://updateuser-6n7me4jtka-uc.a.run.app";
export const defaultCharitiesUrl = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getDefaultCharities" : "https://getdefaultcharities-6n7me4jtka-uc.a.run.app";
