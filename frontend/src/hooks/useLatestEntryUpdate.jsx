import { useState } from "react";
import { getFirestore, collection, query, orderBy, limit, getDocs, doc, updateDoc } from "firebase/firestore";

/**
 * Custom hook to update a specific campaign object in the latest entry from a Firestore collection.
 * If the key does not exist in the campaign, it creates the key and updates it.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {object} campaign - The campaign object to target for the update.
 * @param {string} keyToUpdate - The field key to update in the campaign.
 * @param {any} valueToUpdate - The new value to update the specified key with (should be an array).
 * @returns {object} - { loading, error, updateLatestEntry }
 */
export const useLatestEntryUpdate = (collectionName, campaign, keyToUpdate, valueToUpdate) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateLatestEntry = async () => {
    setLoading(true);
    try {
      const db = getFirestore();
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, orderBy("createdAt", "desc"), limit(1));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error("No entries available to update.");
      }

      const latestDoc = snapshot.docs[0];
      const latestData = latestDoc.data();
      const campaignsArray = latestData.campaigns || [];

      const updatedCampaigns = campaignsArray.map((existingCampaign) => {
        if (existingCampaign.campaignID === campaign.campaignID) {
          return {
            ...existingCampaign,
            [keyToUpdate]: Array.isArray(existingCampaign[keyToUpdate])
              ? [...new Set([...existingCampaign[keyToUpdate], ...valueToUpdate])]
              : valueToUpdate,
          };
        }
        return existingCampaign;
      });

      const docRef = doc(db, collectionName, latestDoc.id);
      await updateDoc(docRef, { campaigns: updatedCampaigns });

      setError(null);
    } catch (err) {
      console.error("Error updating latest entry:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, updateLatestEntry };
};
