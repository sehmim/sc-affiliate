import * as functions from 'firebase-functions';
import { db } from '../../index';
import handleCorsMiddleware from '../../utils/corsMiddleware';
import { constructUpdatedCamapgins, generateDeepLink, getAccessToken, getMerchByAppStatus, getRakutenAdvertiserById, normalizeRakutenCampaigns } from './rakuten';
import { storeData } from '../../utils/firestoreWrapper';

export const triggerRakutenCampaigns = functions.https.onRequest(async (req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const accessToken = await getAccessToken();
      const merchesByAppStatuses = await getMerchByAppStatus(accessToken);

      const rakutenCampaignPromises = merchesByAppStatuses.map((_merch: any, index: number) => {
          return getRakutenAdvertiserById(accessToken, merchesByAppStatuses[index]["ns1:mid"]);
      })

      const rakutenCampaignsObject = await Promise.all(rakutenCampaignPromises); 

      const { campaigns } = normalizeRakutenCampaigns(rakutenCampaignsObject, merchesByAppStatuses);

      const updatedArray = await constructUpdatedCamapgins(campaigns);


      await storeData('rakutenCampaigns', {
        createdAt: new Date().toISOString(),
        campaigns: updatedArray
      });

      res.status(200).json({
        createdAt: new Date().toISOString(),
        campaigns: updatedArray
      });
    } catch (error) {
      console.error('Error fetching advertisers:', error);
      res.status(500).send('Failed to fetch advertisers');
    }
  })
});

export function replaceSpacesWithUnderscore(teamName: string) {
    return teamName.replace(/[^a-zA-Z0-9]/g, '_');
}

export const applyRakutenDeepLink = functions.https.onRequest(async (req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const { advertiserUrl, advertiserId, teamName } = req.body;

      if (!teamName || !advertiserId || !advertiserUrl) {
        return res.status(400).send("teamName, advertiserId, and advertiserUrl are required.");
      }



      // Check if a deep link already exists in Firestore for the given teamName and advertiserId
      const snapshot = await db
        .collection('rakutenDeeplink')
        .where('teamName', '==', teamName)
        .where('programId', '==', advertiserId)
        .get();

      // If a matching deep link is found, return it
      if (!snapshot.empty) {
        const storedDeepLink = snapshot.docs[0].data();
        return res.status(200).json(storedDeepLink.trackingLink);
      }

      // Generate a new deep link if no document was found
      const accessToken = await getAccessToken();
      const dashedTeamname = replaceSpacesWithUnderscore(teamName);
      const payload = {
        url: advertiserUrl,
        advertiser_id: Number(advertiserId),
        u1: dashedTeamname
      };

      const trackingLinks = await generateDeepLink(accessToken, payload);

      // Store the new deep link in Firestore
      await db.collection('rakutenDeeplink').add({
        teamName,
        programId: Number(advertiserId),
        appliedDate: new Date(),
        trackingLink: trackingLinks.trackingLink,
      });

      // Return the newly generated deep link
      return res.status(200).json(trackingLinks.trackingLink);
      
    } catch (error) {
      console.error("Error generating deep link:", error);
      return res.status(500).send(`Failed to generate deep link: ${JSON.stringify(error)}`);
    }
  });
});
