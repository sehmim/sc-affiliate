import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, updateDoc, doc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Button } from 'react-bootstrap';
import { firestore } from '../../../utils/firebase';

const FeaturedCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [featureLoading, setFeatureLoading] = useState({});

  useEffect(() => {
    const fetchFeaturedCampaigns = async () => {
      try {
        const impactCampaignsSyncedRef = collection(firestore, 'impactCampaignsSynced');
        const q = query(impactCampaignsSyncedRef, orderBy('createdAt', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error('No documents found in impactCampaignsSynced.');
        }

        const latestDoc = querySnapshot.docs[0];
        const latestData = latestDoc.data();
        const campaignsArray = latestData.campaigns;

        // Filter campaigns to show only those with isFeatured = true
        const featuredCampaigns = campaignsArray.filter(campaign => campaign.isFeatured);

        setCampaigns(featuredCampaigns);
        setLastUpdated(latestData.createdAt);
      } catch (error) {
        console.error('Error fetching featured campaigns:', error);
      }
    };

    fetchFeaturedCampaigns();
  }, []);

  const removeFromFeatureInCampaignsArray = async (campaignID) => {
    try {
      const impactCampaignsSyncedRef = collection(firestore, 'impactCampaignsSynced');
      const q = query(impactCampaignsSyncedRef, orderBy('createdAt', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('No documents found in impactCampaignsSynced.');
      }

      const latestDoc = querySnapshot.docs[0];
      const latestData = latestDoc.data();
      const campaignsArray = latestData.campaigns;

      const updatedCampaignsArray = campaignsArray.map((campaign) => {
        if (campaign.campaignID === campaignID) {
          return { ...campaign, isFeatured: false }; // Remove from featured
        }
        return campaign;
      });

      const docRef = doc(firestore, 'impactCampaignsSynced', latestDoc.id);
      await updateDoc(docRef, { campaigns: updatedCampaignsArray });

      console.log(`Campaign ${campaignID} successfully removed from featured.`);
      // Update the state to reflect the removal
      setCampaigns(updatedCampaignsArray.filter(campaign => campaign.isFeatured));
    } catch (error) {
      console.error('Error updating campaign in Firestore:', error);
    }
  };

  return (
    <div className="m-4">
        <h3 className='mb-4'>Featured Campaigns/Brands</h3>

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
            <th>Action</th> {/* Action column */}
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
                <Button
                  variant="danger"
                  onClick={() => removeFromFeatureInCampaignsArray(campaign.campaignID)}
                  disabled={featureLoading[campaign.campaignID]}
                >
                  {featureLoading[campaign.campaignID] ? 'Removing...' : 'Remove from Feature'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeaturedCampaigns;
