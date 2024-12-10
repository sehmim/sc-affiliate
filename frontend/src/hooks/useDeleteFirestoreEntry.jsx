import { useState } from "react";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

/**
 * Custom hook to delete an entry from a Firestore collection.
 * @param {string} collectionName - The name of the Firestore collection.
 * @returns {object} - { deleteEntry, loading, error }
 */
export const useDeleteFirestoreEntry = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteEntry = async (id) => {
    if (!collectionName) {
      setError("Collection name is required");
      return;
    }

    if (!id) {
      setError("Document ID is required");
      return;
    }

    setLoading(true);
    try {
      const db = getFirestore();
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { deleteEntry, loading, error };
};
