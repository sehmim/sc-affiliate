import React, { useEffect, useState } from 'react';
import { fetchLatestEntry, saveCampaign } from './ImpactCampaigns'; // Assuming saveCampaign is a function to save data

const RakutenCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [lastUpdated, setLastUpdated] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCampaignId, setEditingCampaignId] = useState(null); // Track which campaign is being edited
  const [featureLoading, setFeatureLoading] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetchLatestEntry('rakutenCampaigns');
        setCampaigns(data.campaigns);
        setLastUpdated(data.createdAt);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle changes to the term inputs
  const handleTermChange = (campaignIndex, termIndex, field, value) => {
    const updatedCampaigns = [...campaigns];
    updatedCampaigns[campaignIndex].terms[termIndex][field] = value;
    setCampaigns(updatedCampaigns);
  };

  // Add a new term to the campaign
  const handleAddTerm = (campaignIndex) => {
    const updatedCampaigns = [...campaigns];
    updatedCampaigns[campaignIndex].terms.push({ title: '', details: '' });
    setCampaigns(updatedCampaigns);
  };

  // Delete a term from the campaign
  const handleDeleteTerm = (campaignIndex, termIndex) => {
    const updatedCampaigns = [...campaigns];
    updatedCampaigns[campaignIndex].terms.splice(termIndex, 1);
    setCampaigns(updatedCampaigns);
  };

  // Save changes for a particular campaign
  const handleSaveTerms = async (campaignId, updatedTerms) => {
    setFeatureLoading((prev) => ({ ...prev, [campaignId]: true }));

    try {
      // await saveCampaign(campaignId, { terms: updatedTerms });
      setEditingCampaignId(null); // Exit editing mode after saving
    } catch (err) {
      console.error('Error saving campaign terms:', err);
    } finally {
      setFeatureLoading((prev) => ({ ...prev, [campaignId]: false }));
    }
  };

  if (loading) {
    return <p>Loading campaigns...</p>;
  }

  if (error) {
    return <p>Error fetching campaigns: {error.message}</p>;
  }

  const Terms = ({ campaign, campaignIndex }) => (
    <td>
      <td>{campaign.subDomains.length > 0 ? campaign.subDomains.join(', ') : 'None'}</td>
      <p>
        <ul>
          {campaign.terms.map((term, termIndex) => (
            <li key={termIndex}>
              {editingCampaignId === campaign.campaignID ? (
                <div>
                  <input
                    type="text"
                    value={term.title}
                    onChange={(e) =>
                      handleTermChange(campaignIndex, termIndex, 'title', e.target.value)
                    }
                    placeholder="Term Title"
                  />
                  <input
                    type="text"
                    value={term.details}
                    onChange={(e) =>
                      handleTermChange(campaignIndex, termIndex, 'details', e.target.value)
                    }
                    placeholder="Term Details"
                  />
                  <button onClick={() => handleDeleteTerm(campaignIndex, termIndex)}>Delete Term</button>
                </div>
              ) : (
                <div>
                  <strong>{term.title}</strong>
                  <p>{term.details}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
        {editingCampaignId === campaign.campaignID && (
          <button onClick={() => handleAddTerm(campaignIndex)}>Add New Term</button>
        )}
      </p>
      <p>
        {editingCampaignId === campaign.campaignID ? (
          <button
            onClick={() => handleSaveTerms(campaign.campaignID, campaigns[campaignIndex].terms)}
            disabled={featureLoading[campaign.campaignID]}
          >
            {featureLoading[campaign.campaignID] ? 'Saving...' : 'Save'}
          </button>
        ) : (
          <button onClick={() => setEditingCampaignId(campaign.campaignID)}>Edit Terms</button>
        )}
      </p>
    </td>
  );

  return (
    <div className="m4">
      <h4>Rakuten Campaigns</h4>
      <p>Last updated: {lastUpdated}</p>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>MID</th>
            <th>Campaign Name</th>
            <th>Campaign Logo</th>
            <th>Advertiser URL</th>
            <th>Default Payout Rate</th>
            <th>Subdomains</th>
            <th>Terms</th> {/* Added a new column for Terms */}
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign, campaignIndex) => (
            <tr key={campaign.campaignID}>
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
              <Terms campaign={campaign} campaignIndex={campaignIndex} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RakutenCampaigns;
