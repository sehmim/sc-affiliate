import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../utils/firebase';

const FeaturedRakutenCampaigns = () => {
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campaignsCollection = collection(firestore, "rakutenCampaigns");
        const snapshot = await getDocs(campaignsCollection);

        const campaignsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter only the campaigns where isFeatured is true
        const filteredCampaigns = campaignsList[0].campaigns.filter(
          (campaign) => campaign.isFeatured
        );

        setFeaturedCampaigns(filteredCampaigns);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading featured campaigns...</p>;
  }

  if (error) {
    return <p>Error fetching featured campaigns: {error.message}</p>;
  }

  if (featuredCampaigns.length === 0) {
    return <p>No featured campaigns available.</p>;
  }

  return (
    <div className='m-4'>
      <h4>Featured Rakuten Campaigns</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Campaign Name</th>
            <th>Campaign Logo</th>
            <th>Advertiser URL</th>
            <th>Default Payout Rate</th>
            <th>Subdomains</th>
          </tr>
        </thead>
        <tbody>
          {featuredCampaigns.map((campaign, index) => (
            <tr key={index}>
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
              <td>{campaign.defaultPayoutRate}%</td>
              <td>{campaign.subDomains.length > 0 ? campaign.subDomains.join(', ') : 'None'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeaturedRakutenCampaigns;
