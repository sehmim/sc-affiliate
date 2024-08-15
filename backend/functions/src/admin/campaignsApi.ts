import * as functions from 'firebase-functions';
import { db } from '../index';
import handleCorsMiddleware from '../corsMiddleware';


// Read Endpoint
export const getCampaigns = functions.https.onRequest((req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const campaignsSnapshot = await db.collection('impactCampaignsSynced').get();
      const campaigns = campaignsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      res.status(200).send(campaigns);
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

