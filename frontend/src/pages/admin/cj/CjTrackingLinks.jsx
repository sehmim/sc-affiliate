import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../utils/firebase';
import { BiChevronUp, BiChevronDown } from 'react-icons/bi'; // Import sorting icons

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

// Function to sort by team name
function sortByTeamName(array, sortOrder = 'asc') {
  return array.sort((a, b) => {
    const teamA = a.teamName?.toLowerCase() || '';
    const teamB = b.teamName?.toLowerCase() || '';

    if (sortOrder === 'asc') {
      return teamA.localeCompare(teamB); // Sort alphabetically ascending
    } else {
      return teamB.localeCompare(teamA); // Sort alphabetically descending
    }
  });
}

// Component to display Cj tracking links
const CjTrackingLinks = () => {
  const [trackingLinks, setTrackingLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'teamName', direction: 'asc' });

  useEffect(() => {
    const fetchTrackingLinks = async () => {
      try {
        setIsLoading(true);
        const querySnapshot = await getDocs(collection(firestore, 'CJDeeplink'));
        const links = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("CJ --->", links);

        // Apply sorting based on the current sortConfig
        let sorted = [...links];
        if (sortConfig.key === 'teamName') {
          sorted = sortByTeamName(sorted, sortConfig.direction);
        } else if (sortConfig.key === 'appliedDate') {
          sorted = sortByAppliedDate(sorted, sortConfig.direction);
        }

        setTrackingLinks(sorted);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tracking links:', error);
        setIsLoading(false);
      }
    };

    fetchTrackingLinks();
  }, [sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? (
        <BiChevronUp className="ms-2" size={16} />
      ) : (
        <BiChevronDown className="ms-2" size={16} />
      );
    }
    return null;
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="container w-full m-3">
      <h1>Cj Tracking Links</h1>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th onClick={() => requestSort('teamName')}>
              Team Name {getSortIcon('teamName')}
            </th>
            <th onClick={() => requestSort('trackingLink')}>
              Cj Tracking Link
            </th>
          </tr>
        </thead>
        <tbody>
          {trackingLinks.map((link, index) => (
            <tr key={index}>
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
