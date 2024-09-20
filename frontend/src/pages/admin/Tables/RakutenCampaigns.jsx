import { collection, getDocs, updateDoc, query, orderBy, limit, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { firestore } from '../../../utils/firebase';
import { fetchLatestEntry } from './ImpactCampaigns';

const RakutenCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [lastUpdated, setLastUpdated] = useState();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featureLoading, setFeatureLoading] = useState({});

  // Fetch campaigns from the rakutenCampaigns collection
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } =  await fetchLatestEntry("rakutenCampaigns");

        setCampaigns(data.campaigns);
        setLastUpdated(data.createdAt)
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to update the "isFeatured" field in Firestore
  const addToFeatureInRakutenCampaigns = async (campaignID) => {
    try {
      setFeatureLoading((prev) => ({ ...prev, [campaignID]: true }));

      // Query to get the latest document
      const rakutenCampaignsRef = collection(firestore, 'rakutenCampaigns');
      const q = query(rakutenCampaignsRef, orderBy('createdAt', 'desc'), limit(1)); 
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('No documents found in rakutenCampaigns.');
      }

      const latestDoc = querySnapshot.docs[0]; // Get the latest document
      const latestData = latestDoc.data();
      const campaignsArray = latestData.campaigns;

      // Update the campaign to be featured
      const updatedCampaignsArray = campaignsArray.map((campaign) => {
        if (campaign.campaignID === campaignID) {
          return { ...campaign, isFeatured: true };
        }
        return campaign;
      });

      // Update Firestore document
      const docRef = doc(firestore, 'rakutenCampaigns', latestDoc.id); 
      await updateDoc(docRef, { campaigns: updatedCampaignsArray });

      console.log(`Campaign ${campaignID} successfully updated to featured.`);
    } catch (error) {
      console.error('Error updating campaign in Firestore:', error);
    } finally {
      setFeatureLoading((prev) => ({ ...prev, [campaignID]: false }));
    }
  };

  if (loading) {
    return <p>Loading campaigns...</p>;
  }

  if (error) {
    return <p>Error fetching campaigns: {error.message}</p>;
  }

  return (
    <div className='m4'>
      <h4>Rakuten Campaigns</h4>
      <p>Last updates: {lastUpdated}</p>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>MID</th>
            <th>Campaign Name</th>
            <th>Campaign Logo</th>
            <th>Advertiser URL</th>
            <th>Default Payout Rate</th>
            <th>Subdomains</th>
            <th>Terms</th> 
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign, index) => (
            <tr key={index}>
              <td>{campaign.campaignID}</td>
              <td>{campaign.campaignName}</td>
              <td>
                <img
                  src={campaign.campaignLogoURI}
                  alt={campaign.campaignName}
                  style={{ width: '100px' }}
                />
              </td>
              <td>
                <a href={campaign.advertiserURL} target="_blank" rel="noopener noreferrer">
                  {campaign.advertiserURL}
                </a>
              </td>
              <td>{campaign.defaultPayoutRate}</td>
              <td>{campaign.subDomains.length > 0 ? campaign.subDomains.join(', ') : 'None'}</td>
              <td>
                <ul>
                  {
                    campaign.terms.length > 0 && campaign.terms.map((term) => {
                      return (
                        <div>
                          <p>{term?.title}</p>
                          <p>{term?.details}</p>
                        </div>
                      )
                    })
                  }
                </ul>
              </td>
              {/* <td>
                {
                  campaign.isFeatured ? (
                    <Button variant="primary" disabled>
                      Featured
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => addToFeatureInRakutenCampaigns(campaign.campaignID)}
                      disabled={featureLoading[campaign.campaignID]}
                    >
                      {featureLoading[campaign.campaignID] ? 'Adding...' : '⭐️'}
                    </Button>
                  )
                }
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RakutenCampaigns;
