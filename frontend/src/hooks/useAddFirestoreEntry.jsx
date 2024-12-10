import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";

/**
 * Custom hook to add an entry to a Firestore collection.
 * @param {string} collectionName - The name of the Firestore collection.
 * @returns {object} - { addEntry, loading, error }
 */
export const useAddFirestoreEntry = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addEntry = async (value) => {
    if (!collectionName) {
      setError("Collection name is required");
      return;
    }

    if (!value || typeof value !== "object") {
      setError("Value must be a valid object");
      return;
    }

    setLoading(true);
    try {
      const db = getFirestore();
      const colRef = collection(db, collectionName);
      await addDoc(colRef, value);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { addEntry, loading, error };
};
