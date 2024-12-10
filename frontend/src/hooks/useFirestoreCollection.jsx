import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

export const useFirestoreCollection = (collectionName, dependency = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const db = getFirestore();
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(docs);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [collectionName, dependency]);

  return { data, loading, error };
};
