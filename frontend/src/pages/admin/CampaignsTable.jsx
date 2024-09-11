import React, { useEffect, useState } from 'react';
import { getSyncedCampaigns, triggerImpactCampaignSync } from '../../api/env';
import {  collection, query, orderBy, limit, getDocs, updateDoc, doc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Button } from 'react-bootstrap';
import { firestore } from '../../utils/firebase';


const CampaignsTable = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [featureLoading, setFeatureLoading] = useState({});
  
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        const campaignsCollection = collection(firestore, "impactCampaignsSynced");
        const snapshot = await getDocs(campaignsCollection);

        const campaignsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const latestCampaigns = campaignsList[0];
        const { campaigns, createdAt } = latestCampaigns;


        setCampaigns(campaigns);
        setLastUpdated(createdAt);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [featureLoading]);

  // useEffect(() => {
  //   fetch(getSyncedCampaigns)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const latestCampaigns = data[0];
  //       const { campaigns, createdAt } = latestCampaigns;
  //       setCampaigns(campaigns);
  //       setLastUpdated(createdAt);
  //     })
  //     .catch((error) => console.error('Error fetching campaigns:', error));
  // }, []);

  const syncCampaigns = async () => {
    setIsLoading(true);
    await fetch(triggerImpactCampaignSync);
    window.location.reload();
  };


const addToFeatureInCampaignsArray = async (campaignID) => {
  try {
    const impactCampaignsSyncedRef = collection(firestore, 'impactCampaignsSynced');
    const q = query(impactCampaignsSyncedRef, orderBy('createdAt', 'desc'), limit(1)); 
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('No documents found in impactCampaignsSynced.');
    }

    const latestDoc = querySnapshot.docs[querySnapshot.docs.length - 1]; 
    const latestData = latestDoc.data();
    const campaignsArray = latestData.campaigns;


    const updatedCampaignsArray = campaignsArray.map((campaign) => {
      if (campaign.campaignID === campaignID) {
        return { ...campaign, isFeatured: true };
      }
      return campaign;
    });

    const docRef = doc(firestore, 'impactCampaignsSynced', latestDoc.id); 
    await updateDoc(docRef, { campaigns: updatedCampaignsArray });

    console.log(`Campaign ${campaignID} successfully updated to featured.`);
  } catch (error) {
    console.error('Error updating campaign in Firestore:', error);
  }
};

if(isLoading) return <div>Loading...</div>
  return (
    <div className="m-4">
      <p>Last updates: {lastUpdated}</p>
      <Button className='mb-3' onClick={() => syncCampaigns()}>
        Sync Campaigns
      </Button>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Campaign Name</th>
            <th>Campaign Logo</th>
            <th>Active Date</th>
            <th>Status</th>
            <th>Advertiser URL</th>
            <th>Subdomains/Deeplinks</th>
            <th>Payout Rate</th>
            <th>Action</th> {/* New Action column */}
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.campaignID}>
              <td>{campaign.campaignName}</td>
              <td>
                <img
                  src={campaign.campaignLogoURI}
                  alt={campaign.campaignName}
                  style={{ width: '100px' }}
                />
              </td>
              <td>{campaign.activeDate}</td>
              <td>{campaign.insertionOrderStatus}</td>
              <td>
                <a href={campaign.advertiserURL} target="_blank" rel="noopener noreferrer">
                  {campaign.advertiserURL}
                </a>
              </td>
              <td>
                {campaign.subDomains.map((domain, index) => (
                  <div key={index}>
                    <a href={domain} target="_blank" rel="noopener noreferrer">
                      {domain}
                    </a>
                  </div>
                ))}
              </td>
              <td>{campaign.defaultPayoutRate}%</td>
              <td>
                {
                  campaign.isFeatured ?                 <Button
                  variant="primary"
                  disabled={campaign.isFeatured}
                >
                  {featureLoading[campaign.campaignID] ? 'Adding...' : 'Add to Feature'}
                </Button> :                 <Button
                  variant="primary"
                  onClick={() => addToFeatureInCampaignsArray(campaign.campaignID)}
                  disabled={featureLoading[campaign.campaignID]}
                >
                  {featureLoading[campaign.campaignID] ? 'Adding...' : 'Add to Feature'}
                </Button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignsTable;
