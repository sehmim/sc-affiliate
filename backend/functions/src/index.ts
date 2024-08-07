import * as admin from "firebase-admin";
import { createCharity, deleteCharity, updateCharity } from "./admin/charitiesApi";
import { getCampaigns, deleteCampaign, updateCampaign } from "./admin/campaignsApi";
import { populatePaymentData, retrievePaymentData } from "./payments/paymentsApi";
import { verifyVerificationCode, sendVerificationCode } from "./auth/authOTP";
import { createUser, getUser, updateUser } from "./users/usersApi";
import { applyTrackingLink, fetchCampaignsData } from "./services/impact";
import { getDefaultCharities } from "./charities/charatyApi";
import { populateCampaignData } from "./campaigns/impactCampaignsApi";
import { collectAndSendBrowserInfo } from "./analytics/analytics";

admin.initializeApp();
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
  collectAndSendBrowserInfo
};