import { onRequest } from "firebase-functions/v2/https";
import handleCorsMiddleware from "../corsMiddleware";
import { db } from '../index';
import * as admin from 'firebase-admin';


export const populatePaymentData = onRequest(async (req, res) => {
  return handleCorsMiddleware(req, res, async () => {
    console.log("populatePaymentData function started");
    try {
      const { campaign_id, amount, sub_id1, currency} = req.query;

      if (!campaign_id || !amount || !sub_id1 || !currency) {
        return res.status(400).send("campaign_id, amount, sub_id1 and currency are required.");
      }

      const paymentData = {
        campaignId: campaign_id as string,
        amount,
        currency,
        charity: sub_id1,
      };

      console.log("Saving payment data:", paymentData);
      await db.collection("payments").add(paymentData);

      return res.status(200).send("Payment data added successfully.");
    } catch (error: any) {
      console.error("Error in populatePaymentData:", error);
      return res.status(500).json({ error: "Failed to save payment data", details: error.message });
    }
  });
});

export const retrievePaymentData = onRequest(async (req, res) => {
  handleCorsMiddleware(req, res, async () => {
    console.log("retrievePaymentData function started");
    try {
      const { campaignId, charity } = req.query;

      let query: admin.firestore.Query<admin.firestore.DocumentData> = db.collection('payments');

      if (campaignId) {
        query = query.where('campaignId', '==', campaignId);
      }
      if (charity) {
        query = query.where('charity', '==', charity);
      }


      const paymentsSnapshot = await query.get();
      const payments = paymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`Retrieved ${payments.length} payment records`);
      res.status(200).json(payments);
    } catch (error: any) {
      console.error("Error in retrievePaymentData:", error);
      res.status(500).json({ error: "Failed to retrieve payment data", details: error.message });
    }
  });
});