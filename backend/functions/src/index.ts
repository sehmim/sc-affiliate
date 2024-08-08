import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { createCharity, deleteCharity, updateCharity } from "./admin/charitiesApi";
import { getCampaigns, deleteCampaign, updateCampaign } from "./admin/campaignsApi";
import { populatePaymentData, retrievePaymentData } from "./payments/paymentsApi";
import { verifyVerificationCode, sendVerificationCode } from "./auth/authOTP";
import { createUser, getUser, updateUser } from "./users/usersApi";
import { applyTrackingLink, fetchCampaignsData } from "./services/impact";
import { getDefaultCharities } from "./charities/charatyApi";
import { populateCampaignData } from "./campaigns/impactCampaignsApi";
import { collectAndSendBrowserInfo } from "./analytics/analytics";
import { syncImpactCampaigns } from "./services/impactCampaignSync";


// admin.initializeApp();
// export const db = admin.firestore();

if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();

export { 
  updateUser,
  createCharity, 
  deleteCharity, 
  updateCharity,
  populateCampaignData, 
  getCampaigns, 
  deleteCampaign, 
  updateCampaign,
  populatePaymentData,
  retrievePaymentData,
  verifyVerificationCode,
  sendVerificationCode,
  createUser,
  getUser,
  fetchCampaignsData,
  applyTrackingLink,
  getDefaultCharities,
  collectAndSendBrowserInfo,
  syncImpactCampaigns
};

// Schedule sync to run every 7 days as per discussed on github issue

/**@DOCUMENTATION
 * If you're curious about the documentation on how the schedule works - know that we are using the 1st gen as the 2nd gen for
 * firebase functions is not currently installed in the project.
 * URL: https://firebase.google.com/docs/functions/schedule-functions?gen=1st
 */
export const scheduledImpactCampaignSync = functions.pubsub
  .schedule("every 7 days")
  .onRun(async (context) => {
    console.log("Running scheduledImpactCampaignSync");
    await syncImpactCampaigns();
    console.log("Finished scheduledImpactCampaignSync");
    return null;
})

// Have to break the pattern that index.ts for now to see if I can even test the function

export const triggerImpactCampaignSync = functions.https.onRequest(async (req, res) => {
  try {
    await syncImpactCampaigns();
    res.status(200).send('Sync Impact Campaigns executed successfully.');
  } catch (error) {
    console.error('Error syncing Impact campaigns:', error);
    res.status(500).send('Error syncing Impact campaigns.');
  }
});