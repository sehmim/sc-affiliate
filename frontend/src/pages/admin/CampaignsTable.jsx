import React, { useEffect, useState } from 'react';
import { getSyncedCampaigns, triggerImpactCampaignSync } from '../../api/env';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Button } from 'react-bootstrap';


const CampaignsTable = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(getSyncedCampaigns)
      .then(response => response.json())
      .then(data => {
        const latestCampaigns = data[0];
        const { campaigns, createdAt } = latestCampaigns;
        setCampaigns(campaigns)
        setLastUpdated(createdAt)
      })
      .catch(error => console.error('Error fetching campaigns:', error));
  }, []);

  const sycCampaings = async () => {
    setIsLoading(true)
    await fetch(triggerImpactCampaignSync)
    window.location.reload();
  }

  return (
     <div className="m-4">
      <p>Last updates: {lastUpdated}</p>
      <Button disabled={isLoading} onClick={() => sycCampaings(true)}>Sync Campaigns</Button>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Campaign Name</th>
            <th>Campaign Logo</th>
            <th>Active Date</th>
            <th>Status</th>
            <th>Advertiser URL</th>
            <th>Subdomains</th>
            <th>PayoutRate</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.campaignID}>
              <td>{campaign.campaignName}</td>
              <td>
                <img src={campaign.campaignLogoURI} alt={campaign.campaignName} style={{ width: '100px' }} />
              </td>
              <td>{campaign.activeDate}</td>
              <td>{campaign.insertionOrderStatus}</td>
              <td><a href={campaign.advertiserURL}>{campaign.advertiserURL}</a></td>
              <td>
                {campaign.subDomains.map((domain, index) => (
                  <div key={index}>
                    <a href={domain} target="_blank" rel="noopener noreferrer">
                      {domain}
                    </a>
                  </div>
                ))}
              </td>
              <td>
                {campaign.defaultPayoutRate}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignsTable;
