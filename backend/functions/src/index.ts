import { createCharity, deleteCharity, updateCharity } from "./controllers/admin/charitiesApi";
import { deleteCampaign, updateCampaign, getSyncedCampaigns } from "./controllers/campagins/campaignsApi";
import { populatePaymentData, retrievePaymentData } from "./controllers/payments/paymentsApi";
import { verifyVerificationCode, sendVerificationCode } from "./controllers/auth/authOTP";
import { createUser, getUser, updateUser } from "./controllers/users/usersApi";
import { fetchImpactCampaignsData } from "./services/impact/impact";
import { applyTrackingLink, triggerImpactCampaignSync } from './services/impact/api';
import { getDefaultCharities } from "./controllers/charities/charatyApi";
import { collectAndSendBrowserInfo } from "./controllers/analytics/analytics";
import * as admin from "firebase-admin";
import { applyRakutenDeepLink, triggerRakutenCampaigns } from "./services/rakuten/api";
import { applyAwinDeepLink, triggerAwinProgrammes } from "./services/awin/api";
import { triggerCJAdvertisers } from "./services/cj/api";

if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();

export { 
  applyAwinDeepLink,
  triggerRakutenCampaigns,
  triggerAwinProgrammes,
  triggerImpactCampaignSync,
  getSyncedCampaigns,
  updateUser,
  createCharity, 
  deleteCharity, 
  updateCharity,
  deleteCampaign, 
  updateCampaign,
  populatePaymentData,
  retrievePaymentData,
  verifyVerificationCode,
  sendVerificationCode,
  createUser,
  getUser,
  fetchImpactCampaignsData,
  applyTrackingLink,
  applyRakutenDeepLink,
  getDefaultCharities,
  collectAndSendBrowserInfo,
  triggerCJAdvertisers
};
