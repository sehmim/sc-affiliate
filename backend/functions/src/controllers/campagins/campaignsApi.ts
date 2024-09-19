import * as functions from 'firebase-functions';
import { db } from '../../index';
import handleCorsMiddleware from '../../utils/corsMiddleware';
import { sortByIsFeatured } from '../admin/helper';
import { generateDeepLink, getAccessToken, getMerchByAppStatus, getRakutenAdvertiserById, normalizeRakutenCampaigns } from '../../services/rakuten/rakuten';
import { getLatestEntry, storeData } from '../../utils/firestoreWrapper';


// Read Endpoint
export const getSyncedCampaigns = functions.https.onRequest((req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const {campaigns: impactCampaigns} = await getLatestEntry('impactCampaignsSynced');
      const impactCampaignsSorted = sortByIsFeatured(impactCampaigns);

      res.status(200).send(impactCampaignsSorted);
    } catch (error) {
      console.error('Error getting campaigns:', error);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Update Endpoint
export const updateCampaign = functions.https.onRequest((req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const campaignId: any = req.query.id;
      const data: Partial<{ [key: string]: any }> = req.body;
      if (!campaignId) {
        res.status(400).send('Campaign ID is required');
        return;
      }

      const campaignDoc = db.collection('impactCampaigns').doc(campaignId);
      await campaignDoc.update(data);
      res.status(200).send('Campaign updated successfully');
    } catch (error) {
      console.error('Error updating campaign:', error);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Delete Endpoint
export const deleteCampaign = functions.https.onRequest((req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const campaignId: any = req.query.id;
      if (!campaignId) {
        res.status(400).send('Campaign ID is required');
        return;
      }

      await db.collection('impactCampaigns').doc(campaignId).delete();
      res.status(200).send('Campaign deleted successfully');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      res.status(500).send('Internal Server Error');
    }
  });
});

export const triggerRakutenCampaigns = functions.https.onRequest(async (req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const accessToken = await getAccessToken();
      const merchesByAppStatuses = await getMerchByAppStatus(accessToken);

      const rakutenCampaignPromises = merchesByAppStatuses.map((_merch: any, index: number) => {
          return getRakutenAdvertiserById(accessToken, merchesByAppStatuses[index]["ns1:mid"]);
      })

      const rakutenCampaignsObject = await Promise.all(rakutenCampaignPromises); 

      const normalizedRakutenCampaigns = normalizeRakutenCampaigns(rakutenCampaignsObject, merchesByAppStatuses);
      await storeData('rakutenCampaigns', normalizedRakutenCampaigns);

      res.status(200).json(normalizedRakutenCampaigns);
    } catch (error) {
      console.error('Error fetching advertisers:', error);
      res.status(500).send('Failed to fetch advertisers');
    }
  })
});

export const applyRakutenDeepLink = functions.https.onRequest(async (req, res) => {
    handleCorsMiddleware(req, res, async () => {
    try {
      const accessToken = await getAccessToken();
      const merchesByAppStatuses = await generateDeepLink(accessToken, req.body);

      await storeData('rakutenDeeplink', merchesByAppStatuses);
      res.status(200).json(merchesByAppStatuses);

    } catch (error) {
      console.log(error)    
    }
  })
});