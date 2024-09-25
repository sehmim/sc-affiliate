import React, { useEffect, useState } from "react";
import { triggerImpactCampaignSync } from "../../../api/env";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Button,  Form, Modal, Spinner  } from "react-bootstrap";
import { firestore } from "../../../utils/firebase";
import { fetchLatestEntry, reorderCampaigns } from "../../../utils/helpts";
import { TermsModal } from "../modals/TermsModal";

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


  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        const { data, id: campaignsID } = await fetchLatestEntry("impactCampaignsSynced");

        setCampaignsID(campaignsID);

        const { campaigns, numberOfActiveCampaigns, numberOfInactiveCampaigns } = reorderCampaigns(data.campaigns)

        setNumberOfActiveCampaigns(numberOfActiveCampaigns);
        setNumberOfInactiveCampaigns(numberOfInactiveCampaigns);
        setCampaigns(campaigns);
        setLastUpdated(data.createdAt);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [featureLoading]);

  const syncCampaigns = async () => {
    setIsLoading(true);
    await fetch(triggerImpactCampaignSync);
    window.location.reload();
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
      // const { data, id } = await fetchLatestEntry("impactCampaignsSynced");
      // const { campaigns: campaignsArray } = data;

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
      // const { data, id } = await fetchLatestEntry("impactCampaignsSynced");
      // const { campaigns: campaignsArray } = data;

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
    if (campaign.isFeatured)
      return (
        <Button
          className="mt-2 w-100"
          variant="primary"
          disabled={campaign.isFeatured}
        >
          {featureLoading[campaign.campaignID] ? "Adding..." : "Featured"}
        </Button>
      );

    return (
      <Button
        className="mt-2 w-100"
        variant="primary"
        onClick={() => addToFeatureInCampaignsArray(campaign.campaignID)}
        disabled={featureLoading[campaign.campaignID]}
      >
        {featureLoading[campaign.campaignID] ? "Adding..." : "Feature"}
      </Button>
    );
  };

  const EnableBrandButton = ({ campaign }) => {
    if (campaign.isActive) {
      return (
        <Button
          onClick={() => disableCampaign(campaign.campaignID)}
          variant="success"
          className="mt-2 w-100"
        >
          Enabled
        </Button>
      );
    }

    return (
      <Button
        onClick={() => activateCampaign(campaign.campaignID)}
        variant="danger"
        className="mt-2 w-100"
      >
        Disabled
      </Button>
    );
  };

const Terms = ({ campaign }) => {
  return (
    <td>
      <div className="d-flex flex-column">
        {campaign.terms.length > 0 &&
          campaign.terms.map((term, termIndex) => {
            if(term.details){
              return (<p className="d-flex flex-column" key={termIndex}>
              <div><b>Title: </b>{term.title}</div>
              {<div><b>Detail: </b>{term.details}</div>}
            </p>)
            }})}
      </div>
    </td>
  );
};

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="m-4">
      <p>Last updates: {lastUpdated}</p>
      <Button className="mb-3" onClick={() => syncCampaigns()}>
        Sync Campaigns
      </Button>
      <p>
        <span>Active: {numberOfActiveCampaigns}</span><br></br>
        <span>Inactive: {numberOfInactiveCampaigns}</span>
      </p>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Campaign Name</th>
            <th>Campaign Logo</th>
            <th>Active Date</th>
            <th>Advertiser URL</th>
            <th>Subdomains/Deeplinks</th>
            <th>Payout Rate</th>
            <th style={{ width: '430px' }}>Terms</th>
            <th>Action</th> {/* New Action column */}
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
                  style={{ width: "100px" }}
                />
              </td>
              <td>{campaign.activeDate}</td>
              <td>
                <a
                  href={campaign.advertiserURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
              <Terms campaign={campaign} />
              <td>
                <AddToFeatureButton campaign={campaign} />
                <br></br>
                <EnableBrandButton campaign={campaign} />
                <br></br>
                <Button
                  onClick={() => setShowModal(campaign)}
                  variant="warning"
                  className="mt-2 w-100"
                >
                  Terms
                </Button>

                <TermsModal 
                  campaignsList={campaigns}
                  campaignsListId={campaignsID}
                  campaign={campaign} 
                  showModal={showModal} 
                  setShowModal={setShowModal} 
                  setFeatureLoading={setFeatureLoading} 
                  editableTerms={editableTerms} 
                  setEditableTerms={setEditableTerms}
                  handleEditTerm={handleEditTerm}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImpactCampaigns;
