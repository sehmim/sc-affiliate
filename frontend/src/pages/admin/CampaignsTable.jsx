import React, { useEffect, useState } from 'react';
import { getSyncedCampaigns } from '../../api/env';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS


const CampaignsTable = () => {
  const [campaigns, setCampaigns] = useState([]);

  console.log("campaigns ->", campaigns)

  useEffect(() => {
    fetch(getSyncedCampaigns)
      .then(response => response.json())
      .then(data => {
        const latestCampaigns = data[0];
        const { campaigns } = latestCampaigns;
        setCampaigns(campaigns)
      })
      .catch(error => console.error('Error fetching campaigns:', error));
  }, []);

  return (
     <div className="m-4">
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Campaign Name</th>
            <th>Campaign Logo</th>
            <th>Active Date</th>
            <th>Status</th>
            <th>Advertiser URL</th>
            <th>Subdomains</th>
            <th>Deals</th>
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
                {
                  campaign.deals.map(({discount})=> (<p>{ discount }</p>))
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
