import { onRequest } from "firebase-functions/v2/https";
import handleCorsMiddleware from "../corsMiddleware";
import { db } from '../index';
import * as admin from 'firebase-admin';


export const populatePaymentData = onRequest(async (req, res) => {
  return handleCorsMiddleware(req, res, async () => {
    console.log("populatePaymentData function started");
    try {
      const { campaign_id, amount, sub_id1, campaign_name} = req.query;

      if (!campaign_id || !amount || !sub_id1 || !campaign_name) {
        return res.status(400).send("campaign_id, amount, sub_id1 and currency are required.");
      }

      const paymentData = {
        campaignId: campaign_id as string,
        amount,
        campaignName: campaign_name,
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

export const getPayments = onRequest(async (req, res) => {
  return handleCorsMiddleware(req, res, async () => { 
    try {
      // verify the firebase ID token
      const idToken = req.headers.authorization?.split('Bearer ')[1];
      if (!idToken) {
        res.status(401).send("Unauthorized");
        return;
      }

      try {
        await admin.auth().verifyIdToken(idToken);
      } catch (error) {
        console.error("Error verifying ID token:", error);
        res.status(403).send('Unauthorized');
        return;
      }

      const { charity } = req.query;

      let query: admin.firestore.Query<admin.firestore.DocumentData> = db.collection('payments');

      if (charity) {
        query = query.where('charity', '==', charity);
      }

      const paymentsSnapshot = await query.get();
      const payments = paymentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as { id: string; charity: string; amount: string | number });

      // aggregate payments
      const aggregatedPayments = payments.reduce((acc: {[key: string]: number}, payment) => {
        if (!acc[payment.charity]) {
          acc[payment.charity] = 0;
        }
        acc[payment.charity] += Number(payment.amount);
        return acc;
      }, {});

      res.status(200).json(aggregatedPayments);
    } catch (error: any) {
      console.error("Error in getPayments:", error);
      res.status(500).json({ error: "Failed to retrieve payment data", details: error.message });
    }
  });
});