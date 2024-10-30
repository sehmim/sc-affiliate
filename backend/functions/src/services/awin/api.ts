import * as functions from 'firebase-functions';
import { db } from '../../index';
import handleCorsMiddleware from '../../utils/corsMiddleware';
import { AwinProgramme, fetchAwinProgrammes, generateAwinLink, getCommissionGroups, normalizeAwinProgrammes, constructUpdatedCamapgins } from './awin';
import { storeData } from '../../utils/firestoreWrapper';

const replaceSpacesWithUnderscore = (text: string) => text.replace(/\s+/g, '_');

export const applyAwinDeepLink = functions.https.onRequest(async (req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const { advertiserUrl, advertiserId, teamName } = req.body;

      if (!teamName || !advertiserId || !advertiserUrl) {
        return res.status(400).send("teamName, advertiserId, and advertiserUrl are required.");
      }

      const dashedTeamName = replaceSpacesWithUnderscore(teamName);

      const snapshot = await db
        .collection('awinDeeplink')
        .where('teamName', '==', dashedTeamName)
        .where('advertiserId', '==', Number(advertiserId))
        .get();

      if (!snapshot.empty) { 
        const storedDeepLink = snapshot.docs[0].data();
        return res.status(200).json(storedDeepLink);
      }

      const parameters = {
        campaign: 'Generated Link',  // Example campaign name
        clickref: dashedTeamName,    // Use the team name as clickref
      };
      const shorten = true;

      const trackingLinks = await generateAwinLink(Number(advertiserId), advertiserUrl, parameters, shorten);

      if (!trackingLinks || trackingLinks.error) {
        throw new Error(`Error generating Awin deep link: ${trackingLinks?.error || 'Unknown error'}`);
      }

      // Store the new deep link in Firestore
      await db.collection('awinDeeplink').add({
        teamName: dashedTeamName,
        advertiserId: Number(advertiserId),
        appliedDate: new Date(),
        trackingLink: trackingLinks.shortUrl || trackingLinks.longUrl,
      });

      // Return the newly generated deep link
      return res.status(200).json(trackingLinks.shortUrl || trackingLinks.longUrl);
      
    } catch (error) {
      console.error("Error generating Awin deep link:", error);
      return res.status(500).send(`Failed to generate Awin deep link: ${JSON.stringify(error)}`);
    }
  });
});


export const triggerAwinProgrammes = functions.https.onRequest(async (req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const programmes = await fetchAwinProgrammes();

      if (!programmes) {
        throw new Error("No Programs found");
        
      }

      const commissionGroupsPromises = programmes.map((progmramme: AwinProgramme) => {
          return getCommissionGroups(progmramme.id);
      })

      const commissionGroups = await Promise.all(commissionGroupsPromises); 
      const normalizedPrograms = normalizeAwinProgrammes(commissionGroups, programmes);

      const updatedArray = await constructUpdatedCamapgins(normalizedPrograms);

      await storeData('awinCampaigns', {
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