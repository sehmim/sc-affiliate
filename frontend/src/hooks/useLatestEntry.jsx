import { useState, useEffect } from "react";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

/**
 * Custom hook to fetch the latest entry from a Firestore collection.
 * @param {string} collectionName - The name of the Firestore collection.
 * @returns {object} - { loading, error, latestEntry }
 */
export const useLatestEntry = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [latestEntry, setLatestEntry] = useState(null);

  useEffect(() => {
    const fetchLatestEntry = async () => {
      setLoading(true);
      try {
        const db = getFirestore();
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, orderBy("date", "desc"), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const latestDoc = snapshot.docs[0];
          setLatestEntry({ id: latestDoc.id, ...latestDoc.data() });
        } else {
          setLatestEntry(null);
          console.warn("No entries found in collection:", collectionName);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching latest entry:", err);
        setError(err.message);
        setLatestEntry(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestEntry();
  }, [collectionName]);

  return { loading, error, latestEntry };
};
