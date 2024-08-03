import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { parseString } from "xml2js";
import { handleCorsMiddleware } from "./corsMiddleware";

import { createCharity, deleteCharity } from "./admin/charitiesApi";
import { getCampaigns, deleteCampaign, updateCampaign } from "./admin/campaignsApi";
import { populateCampaignData } from "./cron/impactCampaigns";
import { populatePaymentData, retrievePaymentData } from "./payments/paymentsApi";
import { verifyVerificationCode, sendVerificationCode } from "./auth/authOTP";
import { createUser, getUser } from "./users/usersApi";


admin.initializeApp();
export const db = admin.firestore();

export { 
  createCharity, 
  deleteCharity, 
  populateCampaignData, 
  getCampaigns, 
  deleteCampaign, 
  updateCampaign,
  populatePaymentData,
  retrievePaymentData,
  verifyVerificationCode,
  sendVerificationCode,
  createUser,
  getUser
};

export const getDefaultCharities = onRequest(async (req, res) => {
  try {
    // Use CORS middleware
    handleCorsMiddleware(req, res, async () => {
      const db = admin.firestore();
      const defaultCharitiesRef = db.collection("defaultCharities");

      const snapshot = await defaultCharitiesRef.get();
      const defaultCharities = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      res.status(200).json(defaultCharities);
    });
  } catch (error) {
    console.error("Error fetching default charities:", error);
    res.status(500).json({ error: "Failed to fetch default charities" });
  }
});

export const applyTrackingLink = onRequest((req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const teamName = req.query.teamName;
      const programId = req.query.programId;
      const email = req.query.email;


      if (!teamName || !programId) {
        return res.status(400).send("teamName and programId query parameters are required.");
      }

      // Retrieve data from Firestore collection 'trackingLinks'
      const snapshot = await admin
        .firestore()
        .collection("trackingLinks")
        .where("teamName", "==", teamName)
        .where("programId", "==", programId)
        .get();

      // If a document matching the provided teamName and programId is found, return the data
      if (!snapshot.empty) {
        const responseData = snapshot.docs[0].data();
        return res.status(200).json(responseData.trackingLink);
      }

      // If no matching document is found, generate a new trackingLink
      const responseData = await generateLink(programId as string, teamName as string, email as string);
      
      // Save the new trackingLink and teamName to Firestore
      await admin.firestore().collection("trackingLinks").add({
        teamName,
        programId,
        linkInitiallyGeneratedBy: email,
        appliedDate: new Date(),
        trackingLink: responseData.TrackingURL,
      });

      // Return the generated trackingLink
      return res.status(200).json(responseData.TrackingURL);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("Error making POST request");
    }
  });
});

export const fetchCampaignsData = onRequest(async (req, res) => {
  try {
    const base64Auth = Buffer.from(
      `IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1:kYSeQ-vzgstPBUan9YZqWzCwRpkD~h7Y`
    ).toString("base64");

    const response = await fetch(
      `https://api.impact.com/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${base64Auth}`,
          "Content-Type": "application/xml", // Specify XML content type
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the XML response and convert it to JSON
    const xmlData = await response.text();
    parseString(xmlData, (err: any, result: any) => {
      if (err) {
        console.error("Error parsing XML:", err);
        res.status(500).send("Error parsing XML");
      } else {
        const campaigns =
          result.ImpactRadiusResponse.Campaigns[0].Campaign.reverse();
        res.status(200).json(campaigns);
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

async function generateLink(programId: string, teamName: string, email: string) {
  try {
    const base64Auth = Buffer.from(
      `IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1:kYSeQ-vzgstPBUan9YZqWzCwRpkD~h7Y`
    ).toString("base64");

    const url = `https://api.impact.com/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Programs/${programId}/TrackingLinks?Type=vanity&subId1=${teamName}&subId2=${email}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64Auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), 
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error making POST request:", error);
  }
}