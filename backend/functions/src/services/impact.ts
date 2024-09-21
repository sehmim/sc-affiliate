import { parseStringPromise } from 'xml2js';
import { onRequest } from 'firebase-functions/v2/https';
import handleCorsMiddleware from '../utils/corsMiddleware';
import { db } from '..';

const IMPACT_BASE_URL = 'https://api.impact.com';
const IMPACT_API_USERNAME = 'IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1';
const IMPACT_API_PASSWORD = 'kYSeQ-vzgstPBUan9YZqWzCwRpkD~h7Y';


export const fetchImpactCampaignsData = async () => {
  try {
    const base64Auth = Buffer.from(
      `${IMPACT_API_USERNAME}:${IMPACT_API_PASSWORD}`
    ).toString("base64");

    const response = await fetch(
      `${IMPACT_BASE_URL}/Mediapartners/${IMPACT_API_USERNAME}/Campaigns`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${base64Auth}`,
          "Content-Type": "application/xml",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const xmlData = await response.text();
    
    const data = await parseStringPromise(xmlData);

    return data;

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchContracts = async () => {
    try {
    const base64Auth = Buffer.from(
      `${IMPACT_API_USERNAME}:${IMPACT_API_PASSWORD}`
    ).toString("base64");

    const response = await fetch(
      `${IMPACT_BASE_URL}/Mediapartners/${IMPACT_API_USERNAME}/Contracts`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${base64Auth}`,
          "Content-Type": "application/xml",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const xmlData = await response.text();
    
    const data = await parseStringPromise(xmlData);

    return data;

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export const fetchCampainDeals = async (campaignId: string) => {
    try {
    const base64Auth = Buffer.from(
      `${IMPACT_API_USERNAME}:${IMPACT_API_PASSWORD}`
    ).toString("base64");

    const response = await fetch(
      `${IMPACT_BASE_URL}/Mediapartners/${IMPACT_API_USERNAME}/Campaigns/${campaignId}/Deals`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${base64Auth}`,
          "Content-Type": "application/xml",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const xmlData = await response.text();
    
    const data = await parseStringPromise(xmlData);

    return data;

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


export async function generateLink(programId: string, teamName: string, email: string) {
  try {
    const base64Auth = Buffer.from(
      `${IMPACT_API_USERNAME}:${IMPACT_API_PASSWORD}`
    ).toString("base64");

    const url = `${IMPACT_BASE_URL}/Mediapartners/${IMPACT_API_USERNAME}/Programs/${programId}/TrackingLinks?Type=vanity&subId1=${teamName}&subId2=${email}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${base64Auth}`,
        "Content-Type": "application/json",
      },
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

export const applyTrackingLink = onRequest((req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const teamName = req.query.teamName as string;
      const programId = req.query.programId as string;
      const email = req.query.email as string;

      if (!teamName || !programId) {
        return res.status(400).send("teamName and programId query parameters are required.");
      }

      // Retrieve data from Firestore collection 'trackingLinks'
      const snapshot = await db
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
      const responseData = await generateLink(programId, teamName, email);
      
      // Save the new trackingLink and teamName to Firestore
      await db.collection("trackingLinks").add({
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
      return res.status(500).send("Error making GET request");
    }
  });
});