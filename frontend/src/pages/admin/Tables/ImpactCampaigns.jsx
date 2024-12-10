import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../../utils/firebase";
import { triggerImpactCampaignSync } from "../../../api/env";
import { fetchLatestEntry, formatToHumanReadable, reorderCampaigns } from "../../../utils/helpers";
import { TermsModal } from "../modals/TermsModal";
import MerchantCategorySelector from "../../../components/CategorySelector";

const ImpactCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [featureLoading, setFeatureLoading] = useState({});
  const [editableTerms, setEditableTerms] = useState({});
  const [numberOfActiveCampaigns, setNumberOfActiveCampaigns] = useState(0);
  const [numberOfInactiveCampaigns, setNumberOfInactiveCampaigns] = useState(0);
  const [showModal, setShowModal] = useState(null);
  const [campaignsID, setCampaignsID] = useState(null);

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    enabled: false,  // Track whether 'enabled' filter is applied
    featured: false, // Track whether 'featured' filter is applied
  });

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        const { data, id: campaignsID } = await fetchLatestEntry("impactCampaignsSynced");
        const { campaigns } = data;
        const { numberOfActiveCampaigns, numberOfInactiveCampaigns } = reorderCampaigns(data.campaigns);

        setCampaignsID(campaignsID);
        setNumberOfActiveCampaigns(numberOfActiveCampaigns);
        setNumberOfInactiveCampaigns(numberOfInactiveCampaigns);
        setCampaigns(campaigns);
        setItemsPerPage(campaigns.length);
        setLastUpdated(formatToHumanReadable(data.createdAt));
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [featureLoading]);

  const syncCampaigns = async () => {
    const userConfirmed = window.confirm("Are you sure you want to sync the campaigns?");
    if (userConfirmed) {
      setIsLoading(true);
      await fetch(triggerImpactCampaignSync);
      window.location.reload();
    } else {
      console.log("Sync canceled");
    }
  };

  const addToFeatureInCampaignsArray = async (campaignID) => {
    setFeatureLoading(true);
    try {
      const updatedCampaignsArray = campaigns.map((campaign) => {
        if (campaign.campaignID === campaignID) {
          return { ...campaign, isFeatured: true };
        }
        return campaign;
      });

      const docRef = doc(firestore, "impactCampaignsSynced", campaignsID);
      await updateDoc(docRef, { campaigns: updatedCampaignsArray });

      setFeatureLoading(false);
      console.log(`Campaign ${campaignID} successfully updated to featured.`);
    } catch (error) {
      setFeatureLoading(false);
      console.error("Error updating campaign in Firestore:", error);
    }
  };

  const handleEditTerm = (campaignID, termIndex, key, value) => {
    setEditableTerms((prevState) => ({
      ...prevState,
      [campaignID]: {
        ...prevState[campaignID],
        [termIndex]: {
          ...prevState[campaignID]?.[termIndex],
          [key]: value,
        },
      },
    }));
  };

  const activateCampaign = async (campaignID) => {
    setFeatureLoading(true);
    try {
      const updatedCampaignsArray = campaigns.map((campaign) => {
        if (campaign.campaignID === campaignID) {
          return { ...campaign, isActive: true };
        }
        return campaign;
      });

      const docRef = doc(firestore, "impactCampaignsSynced", campaignsID);
      await updateDoc(docRef, { campaigns: updatedCampaignsArray });

      setFeatureLoading(false);
      console.log(`Campaign ${campaignID} successfully activated.`);
    } catch (error) {
      setFeatureLoading(false);
      console.error("Error updating campaign in Firestore:", error);
    }
  };

  const disableCampaign = async (campaignID) => {
    setFeatureLoading(true);
    try {
      const updatedCampaignsArray = campaigns.map((campaign) => {
        if (campaign.campaignID === campaignID) {
          return { ...campaign, isActive: false };
        }
        return campaign;
      });

      const docRef = doc(firestore, "impactCampaignsSynced", campaignsID);
      await updateDoc(docRef, { campaigns: updatedCampaignsArray });

      setFeatureLoading(false);
      console.log(`Campaign ${campaignID} successfully disabled.`);
    } catch (error) {
      setFeatureLoading(false);
      console.error("Error updating campaign in Firestore:", error);
    }
  };

  const AddToFeatureButton = ({ campaign }) => {
    return (
      <div className="form-check form-switch mt-2 w-100">
        <label className="form-check-label" htmlFor={`featureSwitch-${campaign.campaignID}`}>
          {featureLoading[campaign.campaignID] ? "Adding..." : campaign.isFeatured ? "Featured" : "Feature"}
        </label>
        <input
          className="form-check-input"
          type="checkbox"
          id={`featureSwitch-${campaign.campaignID}`}
          checked={campaign.isFeatured || featureLoading[campaign.campaignID]}
          disabled={featureLoading[campaign.campaignID]}
          onChange={() => addToFeatureInCampaignsArray(campaign.campaignID)}
        />
      </div>
    );
  };

  const EnableBrandButton = ({ campaign }) => {
    return (
      <div className="form-check form-switch mt-2 w-100">
        <input
          className="form-check-input"
          type="checkbox"
          id={`brandSwitch-${campaign.campaignID}`}
          checked={campaign.isActive}
          onChange={() =>
            campaign.isActive
              ? disableCampaign(campaign.campaignID)
              : activateCampaign(campaign.campaignID)
          }
        />
        <label className="form-check-label" htmlFor={`brandSwitch-${campaign.campaignID}`}>
          {campaign.isActive ? "Enabled" : "Disabled"}
        </label>
      </div>
    );
  };

  const Terms = ({ campaign }) => {
    return (
      <td>
        <div className="d-flex flex-column">
          {campaign.terms.length > 0 &&
            campaign.terms.map((term, termIndex) => {
              if (term.details) {
                return (
                  <p className="d-flex flex-column" key={termIndex}>
                    <div><b>Title: </b>{term.title}</div>
                    <div><b>Detail: </b>{term.details}</div>
                    <hr />
                  </p>
                );
              }
            })}
        </div>
      </td>
    );
  };

  // Filter campaigns based on the selected filters (enabled and featured)
  const filteredCampaigns = campaigns.filter((campaign) => {
    if (filters.enabled && filters.featured) {
      return campaign.isActive && campaign.isFeatured;
    }
    if (filters.enabled) {
      return campaign.isActive;
    }
    if (filters.featured) {
      return campaign.isFeatured;
    }
    return true; // Show all if neither is selected
  }).filter((campaign) =>
    campaign.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCampaigns.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="m-4">
      <p><b>Last updates: </b>{lastUpdated}</p>
      <Button className="mb-3" onClick={() => syncCampaigns()}>
        Sync Campaigns
      </Button>
      <p>
        <span>Active: {numberOfActiveCampaigns}</span><br />
        <span>Inactive: {numberOfInactiveCampaigns}</span>
      </p>
      
      {/* Search input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search Campaigns"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter checkboxes */}
      <div className="mb-3">
        <div className="form-check">
          <input
            type="checkbox"
            id="enabledFilter"
            className="form-check-input"
            checked={filters.enabled}
            onChange={() => setFilters((prev) => ({ ...prev, enabled: !prev.enabled }))}
          />
          <label className="form-check-label" htmlFor="enabledFilter">
            Show Enabled
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            id="featuredFilter"
            className="form-check-input"
            checked={filters.featured}
            onChange={() => setFilters((prev) => ({ ...prev, featured: !prev.featured }))}
          />
          <label className="form-check-label" htmlFor="featuredFilter">
            Show Featured
          </label>
        </div>
      </div>

      {/* Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Campaign</th>
            <th>Advertiser URL</th>
            <th>Sub Domains</th>
            <th>Payout</th>
            <th>Categories</th>
            <th>Terms</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((campaign) => (
            <tr key={campaign.campaignID}>
              <td>
                <img src={campaign.campaignLogoURI} alt="Campaign Logo" width="150" height="150" />
              </td>
              <td>{campaign.campaignName}</td>
              <td><a href={campaign.advertiserURL} target="_blank" rel="noopener noreferrer">{campaign.advertiserURL}</a></td>
              <td>
                <div>{campaign.subDomains.map((subDomain, index) => (
                  <div key={index}>{subDomain}</div>
                ))}</div>
              </td>
              <td>{campaign.defaultPayoutRate}%</td>
              <MerchantCategorySelector collection={'impactCampaignsSynced'} campaign={campaign} />
              <Terms campaign={campaign} />
              <td>
                <EnableBrandButton campaign={campaign} />
                <AddToFeatureButton campaign={campaign} />
                <Button
                  onClick={() => setShowModal(campaign)}
                  variant="outline-secondary"
                  className="mt-2 w-100"
                >
                  Terms
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {/* <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            {[...Array(Math.ceil(filteredCampaigns.length / itemsPerPage))].map((_, index) => (
              <li className="page-item" key={index}>
                <button
                  className="page-link"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div> */}

      {
      showModal && <TermsModal 
        collectionName={"impactCampaignsSynced"}
        campaignsList={campaigns}
        campaignsListId={campaignsID}
        campaign={showModal} 
        showModal={showModal} 
        setShowModal={setShowModal} 
        setFeatureLoading={setFeatureLoading} 
        editableTerms={editableTerms} 
        handleEditTerm={handleEditTerm}
      />
      }
    </div>
  );
};

export default ImpactCampaigns;
