import { onRequest } from 'firebase-functions/v2/https'; // Make sure to import the necessary Firebase functions
import handleCorsMiddleware from '../../utils/corsMiddleware';
import { db } from '../..';
import { generateLink, getDeepLink } from './impact';
import { replaceSpacesWithUnderscore } from '../rakuten/api';

export const applyTrackingLink = onRequest((req, res) => {
  handleCorsMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send("Method Not Allowed. Please use POST.");
    }

    try {
      // Get data from the request body
      const { campaign, userSettings, hostName } = req.body;

      const teamName = replaceSpacesWithUnderscore(userSettings.selectedCharityObject.organizationName);
      const email = userSettings.email;
      const programId = campaign.campaignID;

      if (!teamName || !programId) {
        return res.status(400).send("teamName and programId are required in the request body.");
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


      const deepLink = campaign?.isDeepLinkEnabled ? getDeepLink(hostName, campaign?.subDomains) : null;
      
      // If no matching document is found, generate a new trackingLink
      const responseData = await generateLink(programId, teamName, email, deepLink);

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
      return res.status(500).send("Error processing request");
    }
  });
});


