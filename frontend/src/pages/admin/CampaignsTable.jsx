import React, { useEffect, useState } from 'react';
import { getCampaigns } from '../../api/env';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS


const CampaignsTable = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetch(getCampaigns)
      .then(response => response.json())
      .then(data => setCampaigns(data))
      .catch(error => console.error('Error fetching campaigns:', error));
  }, []);

  return (
     <div className="m-4">
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Advertiser Name</th>
            <th>Campaign Name</th>
            <th>Campaign Logo</th>
            <th>Active Date</th>
            <th>Status</th>
            <th>Payout</th>
            <th>Discount Percentage</th>
            <th>Discount Type</th>
            <th>Advertiser URL</th>
            <th>Subdomains</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.campaignID}>
              <td>{campaign.advertiserName}</td>
              <td>{campaign.campaignName}</td>
              <td>
                <img src={campaign.campaignLogoURI} alt={campaign.campaignName} style={{ width: '100px' }} />
              </td>
              <td>{campaign.activeDate}</td>
              <td>{campaign.insertionOrderStatus}</td>
              <td>{campaign.payout}</td>
              <td>{campaign.discountPercentage}%</td>
              <td>{campaign.discountType}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignsTable;
