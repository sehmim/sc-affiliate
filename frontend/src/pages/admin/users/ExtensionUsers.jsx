import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../utils/firebase';
import { BiChevronUp, BiChevronDown } from 'react-icons/bi'; // Importing the sorting icons

const ExtensionUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'email', direction: 'ascending' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(firestore, 'users'));
        const users = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(users);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center">Loading users...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  // Sorting function
const sortedUsers = [...users].sort((a, b) => {
  const aValue = a[sortConfig.key];
  const bValue = b[sortConfig.key];

  // Handle 'lastLoggedIn' specifically
  if (sortConfig.key === 'lastLoggedIn') {
    if (!aValue && !bValue) return 0; // Both are missing, no change
    if (!aValue) return 1; // `a` missing, push to the bottom
    if (!bValue) return -1; // `b` missing, push to the bottom

    const aDate = aValue.seconds ? new Date(aValue.seconds * 1000) : new Date(aValue);
    const bDate = bValue.seconds ? new Date(bValue.seconds * 1000) : new Date(bValue);

    return sortConfig.direction === 'ascending'
      ? aDate - bDate
      : bDate - aDate;
  }

  // Handle other columns
  if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
  if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
  return 0;
});

  // Request sorting for a specific column
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Helper function to render sorting icons
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

  // Function to format the date from Firebase Timestamp or ISO string
const formatDate = (date) => {
  if (!date) return '';

  const formatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const format = (dateObject) =>
    new Intl.DateTimeFormat('en-US', formatOptions).format(dateObject);

  // Handle Firebase Timestamp (seconds + nanoseconds)
  if (date.seconds) {
    return format(new Date(date.seconds * 1000));
  }

  // Handle ISO string (e.g., "2024-10-24T18:24:10.603Z")
  if (typeof date === 'string') {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate)) {
      return format(parsedDate);
    }
  }

  return 'Invalid Date'; // Return if date is invalid
};

  return (
    <div className="mt-2">
      <h1 className="mb-4">Extension Users</h1>
      <span>Total Users: {users.length}</span>
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th onClick={() => requestSort('email')}>
              Email {getSortIcon('email')}
            </th>
            <th onClick={() => requestSort('firstName')}>
              First Name {getSortIcon('firstName')}
            </th>
            <th onClick={() => requestSort('lastName')}>
              Last Name {getSortIcon('lastName')}
            </th>
            <th onClick={() => requestSort('lastLoggedIn')}>
              Last Logged In {getSortIcon('lastLoggedIn')}
            </th>
            <th onClick={() => requestSort('selectedCharityObject.organizationName')}>
              Currently Selected Charity {getSortIcon('selectedCharityObject.organizationName')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.email || 'N/A'}</td>
              <td>{user.firstName || 'N/A'}</td>
              <td>{user.lastName || 'N/A'}</td>
              <td>{formatDate(user.lastLoggedIn)}</td>
              <td>{user.selectedCharityObject?.organizationName || 'None'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExtensionUsers;
