import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../utils/firebase';

// Function to sort by applied date
function sortByAppliedDate(array, sortOrder = 'desc') {
  return array.sort((a, b) => {
    const dateA = new Date(a.appliedDate);
    const dateB = new Date(b.appliedDate);

    if (sortOrder === 'asc') {
      return dateA.getTime() - dateB.getTime(); // Sort ascending (oldest first)
    } else {
      return dateB.getTime() - dateA.getTime(); // Sort descending (latest first)
    }
  });
}

// Component to display Cj tracking links
const CjTrackingLinks = () => {
  const [trackingLinks, setTrackingLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrackingLinks = async () => {
      try {
        setIsLoading(true);
        const querySnapshot = await getDocs(collection(firestore, 'cjDeeplink'));
        const links = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          appliedDate: new Date(doc.data().appliedDate.seconds * 1000 + doc.data().appliedDate.nanoseconds / 1000000).toLocaleString()
        }));

        const sorted = sortByAppliedDate(links);
        setTrackingLinks(sorted);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tracking links:', error);
        setIsLoading(false);
      }
    };

    fetchTrackingLinks();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="container w-full m-3">
      <h1>Cj Tracking Links</h1>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Applied Date</th>
            <th>Advertiser ID</th>
            <th>Team Name</th>
            <th>Cj Tracking Link</th>
          </tr>
        </thead>
        <tbody>
          {trackingLinks.map((link, index) => (
            <tr key={index}>
              <td>{link.appliedDate}</td>
              <td>{link.advertiserId}</td>
              <td>{link.teamName}</td>
              <td>{link.trackingLink}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CjTrackingLinks;
