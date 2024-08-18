import { onRequest } from "firebase-functions/v2/https";
import * as functions from 'firebase-functions';
import * as cors from 'cors';
import handleCorsMiddleware from "../corsMiddleware";
import { db } from '../index';


export const createUser = onRequest((req, res) => {
    handleCorsMiddleware(req, res, async () => {
        try {
            const { email, firstName, lastName } = req.body;

            if (!email) {
                res.status(400).send('Email is required.');
                return;
            }

            // Check if user with the given email already exists
            const userQuery = db.collection('users').where('email', '==', email);
            const snapshot = await userQuery.get();

            if (!snapshot.empty) {
                res.status(200).send('User already exists.');
                return;
            }

            // Create the user if they do not exist
            const userRef = await db.collection('users').add({
                firstName: firstName || "",
                lastName: lastName || "",
                email: email,
            });

            res.status(201).send({ id: userRef.id, message: 'User created successfully' });
        } catch (error) {
            console.error('Error creating user: ', error);
            res.status(500).send('Internal Server Error');
        }
    });
});

export const getUser = onRequest((req, res) => {
  handleCorsMiddleware(req, res, async () => {
    try {
      const { email } = req.query;

      // Basic validation
      if (!email) {
        res.status(400).send('Email is required.');
        return;
      }

      // Query the user document by email
      const userRef = db.collection('users').where('email', '==', email);
      const snapshot = await userRef.get();

      if (snapshot.empty) {
        res.status(404).send('User not found.');
        return;
      }

      // Send the user data (assuming only one user per email)
      const userData = snapshot.docs[0].data();
      res.status(200).send(userData);
    } catch (error) {
      console.error('Error fetching user data: ', error);
      res.status(500).send('Internal Server Error');
    }
  });
});

export const updateUser = functions.https.onRequest((req, res) => {
  const corsHandler = cors({
    origin: ['https://localhost:3000', 'https://sc-affiliate.vercel.app'],
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const { email, ...updates } = req.body;

    if (!email || Object.keys(updates).length === 0) {
      return res.status(400).send('Bad Request: Email and update data are required');
    }

    try {
      const userRef = db.collection('users').where('email', '==', email);
      const snapshot = await userRef.get();

      if (snapshot.empty) {
        res.status(404).send('User not found.');
        return;
      }

      const userId = snapshot.docs[0].id;
      await db.collection('users').doc(userId).update(updates);

      return res.status(200).send('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).send('Internal Server Error');
    }
  });
});


// export const updateUserOld = onRequest((req, res) => {
//   handleCorsMiddleware(req, res, async () => {
//     try {
//       const { email, updates } = req.body;

//       // Basic validation
//       if (!email || !updates) {
//         res.status(400).send('Email and updates are required.');
//         return;
//       }

//       // Query the user document by email
//       const userRef = db.collection('users').where('email', '==', email);
//       const snapshot = await userRef.get();

//       if (snapshot.empty) {
//         res.status(404).send('User not found.');
//         return;
//       }

//       // Update the user document (assuming only one user per email)
//       const userId = snapshot.docs[0].id;
//       await db.collection('users').doc(userId).update(updates);

//       res.status(200).send('User updated successfully.');
//     } catch (error) {
//       console.error('Error updating user data: ', error);
//       res.status(500).send('Internal Server Error');
//     }
//   });
// });