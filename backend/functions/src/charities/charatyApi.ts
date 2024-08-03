import { onRequest } from "firebase-functions/v2/https";
import handleCorsMiddleware from "../corsMiddleware";
import { db } from '../index';

export const getDefaultCharities = onRequest(async (req, res) => {
  try {
    // Use CORS middleware
    handleCorsMiddleware(req, res, async () => {
      const defaultCharitiesRef = db.collection("defaultCharities");

      const snapshot = await defaultCharitiesRef.get();
      const defaultCharities = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      res.status(200).json(defaultCharities);
    });
  } catch (error) {
    console.error("Error fetching default charities:", error);
    res.status(500).json({ error: "Failed to fetch default charities" });
  }
});
