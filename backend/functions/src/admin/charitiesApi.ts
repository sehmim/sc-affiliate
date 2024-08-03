// src/functions/createCharity.ts
import * as functions from 'firebase-functions';
import { db } from '../index';
import handleCorsMiddleware from '../corsMiddleware';

interface Charity {
    address: string;
    category: string;
    charityType: string;
    city: string;
    country: string;
    effectiveDateOfStatus: string;
    isActive: boolean;
    logo: string;
    organizationName: string;
    postalCode: string;
    provinceTerritoryOutsideOfCanada: string;
    registrationNumber: string;
    sanctionDesignation: string;
    status: string;
    typeOfQualifiedDone: string;
}

export const createCharity = functions.https.onRequest((req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const data: Charity = req.body;
      const newCharityRef = await db.collection('defaultCharities').add(data);
      res.status(201).send({ id: newCharityRef.id });
    } catch (error) {
      console.error('Error creating charity:', error);
      res.status(500).send('Internal Server Error');
    }
  });
});

export const deleteCharity = functions.https.onRequest((req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const charityId: any = req.query.id;
      if (!charityId) {
        res.status(400).send('Charity ID is required');
        return;
      }

      await db.collection('defaultCharities').doc(charityId).delete();
      res.status(200).send('Charity deleted successfully');
    } catch (error) {
      console.error('Error deleting charity:', error);
      res.status(500).send('Internal Server Error');
    }
  });
});

export const updateCharity = functions.https.onRequest((req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const charityId: any = req.query.id;
      const data: any = req.body;

      if (!charityId) {
        res.status(400).send('Charity ID is required');
        return;
      }

      await db.collection('defaultCharities').doc(charityId).update(data);
      res.status(200).send('Charity updated successfully');
    } catch (error) {
      console.error('Error updating charity:', error);
      res.status(500).send('Internal Server Error');
    }
  });
});