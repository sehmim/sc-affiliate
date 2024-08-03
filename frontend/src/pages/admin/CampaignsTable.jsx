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
            <th>Insertion Order Name</th>
            <th>Status</th>
            <th>Allows Deep Linking</th>
            <th>Payout</th>
            <th>Performance Bonus</th>
            <th>Click Referral Period</th>
            <th>Action Locking</th>
            <th>Discount Percentage</th>
            <th>Discount Type</th>
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
              <td>{campaign.insertionOrderName}</td>
              <td>{campaign.insertionOrderStatus}</td>
              <td>{campaign.allowsDeepLinking ? 'Yes' : 'No'}</td>
              <td>{campaign.payout}</td>
              <td>{campaign.performanceBonus}</td>
              <td>{campaign.clickReferralPeriod}</td>
              <td>{campaign.actionLocking}</td>
              <td>{campaign.discountPercentage}%</td>
              <td>{campaign.discountType}</td>
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
