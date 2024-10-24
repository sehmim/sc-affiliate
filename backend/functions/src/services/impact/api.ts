import { onRequest } from 'firebase-functions/v2/https'; // Make sure to import the necessary Firebase functions
import handleCorsMiddleware from '../../utils/corsMiddleware';
import { db } from '../..';
import { generateLink, getDeepLink } from './impact';
import { replaceSpacesWithUnderscore } from '../rakuten/api';
import { ensureHttps } from '../../utils/helper';

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
        .collection("impactTrackingLinksDev")
        .where("teamName", "==", teamName)
        .where("programId", "==", programId)
        .get();

      // If a document matching the provided teamName and programId is found, return the data
      if (!snapshot.empty) {
        const responseData = snapshot.docs[0].data();
        
        if (!responseData.trackingLink.includes('fanatics')) {
          return res.status(200).json(ensureHttps(responseData.trackingLink));
        }
      }


      const deepLink = campaign?.isDeepLinkEnabled ? getDeepLink(hostName, campaign?.subDomains) : null;
      
      // If no matching document is found, generate a new trackingLink
      const responseDataResponse = await generateLink(programId, teamName, email, deepLink);
      const trackingLink = ensureHttps(responseDataResponse.TrackingURL);

      // Save the new trackingLink and teamName to Firestore
      await db.collection("impactTrackingLinksDev").add({
        teamName,
        programId,
        linkInitiallyGeneratedBy: email,
        appliedDate: new Date(),
        trackingLink,
      });

      // Return the generated trackingLink
      return res.status(200).json(trackingLink);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("Error processing request");
    }
  });
});


