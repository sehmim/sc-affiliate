import { onRequest } from "firebase-functions/v2/https";
import handleCorsMiddleware from "../corsMiddleware";
import { db } from '../index';
import * as admin from 'firebase-admin';



/**
 * @NOTE this is not fully done yet I'm serving this as a reminder
 * - Julio
 */
export const populatePaymentData = onRequest(async (req, res) => {
  return handleCorsMiddleware(req, res, async () => {
    console.log("populatePaymentData function started");
    try {
      const { campaignId, amount, subId1 } = req.query;

      if (!campaignId || !amount || !subId1) {
        return res.status(400).send("campaignId, amount, and subId1 are required.");
      }

      const paymentData = {
        campaignId: campaignId as string,
        amount: parseFloat(amount as string),
        charity: subId1 as string,
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