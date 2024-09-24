import React, { useState, useEffect } from 'react';
import { getSyncedCampaigns } from '../../../api/env';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const ActiveCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(getSyncedCampaigns);
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <div className="text-center">Loading campaigns...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

return (
    <div className="mt-2">
      <h1 className="mb-4">Active Campaigns</h1>
      <span>Total: {campaigns.length}</span>
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Campaign Name</th>
            <th>Logo</th>
            <th>Default Payout Rate</th>
            <th>Advertiser URL</th>
            <th>Active</th>
            <th>Featured</th>
            <th>Terms</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.campaignID}>
              <td>{campaign.campaignName}</td>
              <td>
                <img src={campaign.campaignLogoURI} alt={campaign.campaignName} width="100" />
              </td>
              <td>{campaign.defaultPayoutRate}</td>
              <td>
                <a href={campaign.advertiserURL} target="_blank" rel="noopener noreferrer">
                  {campaign.advertiserURL}
                </a>
              </td>
              <td>{campaign.isActive ? 'Yes' : 'No'}</td>
              <td>{campaign.isFeatured ? 'Yes' : 'No'}</td>
              <td>
                {campaign.terms.map((term, index) => (
                  <div key={index}>
                    <strong>{term.title}</strong>: {term.details}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveCampaigns;
