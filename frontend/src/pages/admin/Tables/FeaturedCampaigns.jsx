import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs, updateDoc, doc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Button } from 'react-bootstrap';
import { firestore } from '../../../utils/firebase';
import FeaturedRakutenCampaigns from './FeaturedRakutenCampaigns';
import { fetchLatestEntry } from '../../../utils/helpts';


const FeaturedCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [featureLoading, setFeatureLoading] = useState({});

  useEffect(() => {
    const fetchFeaturedCampaigns = async () => {
      try {
        const { data } = await fetchLatestEntry('impactCampaignsSynced');
        const { campaigns, createdAt } = data;

        const featuredCampaigns = campaigns.filter(campaign => campaign.isFeatured);
        
        setCampaigns(featuredCampaigns);
        setLastUpdated(createdAt);
      } catch (error) {
        console.error('Error fetching featured campaigns:', error);
      }
    };

    fetchFeaturedCampaigns();
  }, []);

  const removeFromFeatureInCampaignsArray = async (campaignID) => {
    try {
      const { data, id } = await fetchLatestEntry('impactCampaignsSynced');
      const { campaigns: campaignsArray, createdAt } = data;

      const updatedCampaignsArray = campaignsArray.map((campaign) => {
        if (campaign.campaignID === campaignID) {
          return { ...campaign, isFeatured: false }; // Remove from featured
        }
        return campaign;
      });

      const docRef = doc(firestore, 'impactCampaignsSynced', id);
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
      <hr></hr>
      <h5 className='mb-4'>Featured Brands from Impact:</h5>
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

      <h5 className='mb-4'>Featured Brands from Rakuten:</h5>
      <FeaturedRakutenCampaigns />
    </div>
  );
};

export default FeaturedCampaigns;
