import * as functions from 'firebase-functions';
import handleCorsMiddleware from '../../utils/corsMiddleware';
import { constructUpdatedCamapgins, fetchCJAdvertisers, normalizeCJAdvertisers } from './cj';
import { storeData } from '../../utils/firestoreWrapper';
import { replaceSpacesWithUnderscore } from '../rakuten/api';
import { db } from '../..';

export const applyCJDeepLink = functions.https.onRequest(async (req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const { advertiserUrl, advertiserId, teamName } = req.body;

      if (!teamName || !advertiserId || !advertiserUrl) {
        return res.status(400).send("teamName, advertiserId, and advertiserUrl are required.");
      }

      const dashedTeamName = replaceSpacesWithUnderscore(teamName);

      const snapshot = await db
        .collection('CJDeeplink')
        .where('teamName', '==', dashedTeamName)
        .where('advertiserId', '==', Number(advertiserId))
        .get();

      if (!snapshot.empty) {
        const storedDeepLink = snapshot.docs[0].data();
        return res.status(200).json(storedDeepLink);
      } else {
        return res.status(404).send(`No CJ Links Found`);
      }
    } catch (error) {
      console.error("Error generating CJ deep link:", error);
      return res.status(500).send(`Failed to generate CJ deep link: ${JSON.stringify(error)}`);
    }
  });
});


export const triggerCJAdvertisers = functions.https.onRequest(async (req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const advertisersResponse = await fetchCJAdvertisers();

      const advertisers = advertisersResponse["cj-api"]["advertisers"][0]["advertiser"]

      const normalizedAdvertisers = normalizeCJAdvertisers(advertisers);

      const updatedArray = await constructUpdatedCamapgins(normalizedAdvertisers);

      await storeData('CJCampaigns', {
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