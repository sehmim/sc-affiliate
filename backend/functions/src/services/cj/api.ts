import * as functions from 'firebase-functions';
import handleCorsMiddleware from '../../utils/corsMiddleware';
import { fetchCJAdvertisers, normalizeCJAdvertisers } from './cj';
import { storeData } from '../../utils/firestoreWrapper';

// export const applyCJDeepLink = functions.https.onRequest(async (req, res) => {
//   handleCorsMiddleware(req, res, async () => {
//     try {
//       const { advertiserUrl, advertiserId, teamName } = req.body;

//       if (!teamName || !advertiserId || !advertiserUrl) {
//         return res.status(400).send("teamName, advertiserId, and advertiserUrl are required.");
//       }

//       const dashedTeamName = replaceSpacesWithUnderscore(teamName);

//       const snapshot = await db
//         .collection('CJDeeplink')
//         .where('teamName', '==', dashedTeamName)
//         .where('advertiserId', '==', Number(advertiserId))
//         .get();

//       if (!snapshot.empty) {
//         const storedDeepLink = snapshot.docs[0].data();
//         return res.status(200).json(storedDeepLink);
//       }

//       const parameters = {
//         campaign: 'Generated Link',  // Example campaign name
//         clickref: dashedTeamName,    // Use the team name as clickref
//       };
//       const shorten = true;

//       const trackingLinks = await generateCJLink(Number(advertiserId), advertiserUrl, parameters, shorten);

//       if (!trackingLinks || trackingLinks.error) {
//         throw new Error(`Error generating CJ deep link: ${trackingLinks?.error || 'Unknown error'}`);
//       }

//       // Store the new deep link in Firestore
//       await db.collection('CJDeeplink').add({
//         teamName: dashedTeamName,
//         advertiserId: Number(advertiserId),
//         appliedDate: new Date(),
//         trackingLink: trackingLinks.shortUrl || trackingLinks.longUrl,
//       });

//       // Return the newly generated deep link
//       return res.status(200).json(trackingLinks.shortUrl || trackingLinks.longUrl);
      
//     } catch (error) {
//       console.error("Error generating CJ deep link:", error);
//       return res.status(500).send(`Failed to generate CJ deep link: ${JSON.stringify(error)}`);
//     }
//   });
// });


export const triggerCJAdvertisers = functions.https.onRequest(async (req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const advertisersResponse = await fetchCJAdvertisers();

      const advertisers = advertisersResponse["cj-api"]["advertisers"][0]["advertiser"]

      const normalizedAdvertisers = normalizeCJAdvertisers(advertisers);

      await storeData('CJCampaigns', {
        createdAt: new Date().toISOString(),
        campaigns: normalizedAdvertisers
      });

      res.status(200).json({
        createdAt: new Date().toISOString(),
        campaigns: normalizedAdvertisers
      });
    } catch (error) {
      console.error('Error fetching advertisers:', error);
      res.status(500).send('Failed to fetch advertisers');
    }
  })
});