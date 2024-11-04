import React, { useEffect, useState } from "react";
import { triggerImpactCampaignSync } from "../../../api/env";
import { updateDoc, doc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Button } from "react-bootstrap";
import { firestore } from "../../../utils/firebase";
import { fetchLatestEntry, formatToHumanReadable, reorderCampaigns } from "../../../utils/helpts";
import { TermsModal } from "../modals/TermsModal";

const CjCampaigns = () => {
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
        const { data, id: campaignsID } = await fetchLatestEntry("CJCampaigns");
        const { campaigns } = data;
        const { numberOfActiveCampaigns, numberOfInactiveCampaigns } = reorderCampaigns(campaigns)

        setCampaignsID(campaignsID);
        setNumberOfActiveCampaigns(numberOfActiveCampaigns);
        setNumberOfInactiveCampaigns(numberOfInactiveCampaigns);
        setCampaigns(campaigns);
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
      const campaignsArray = [...campaigns];

      const updatedCampaignsArray = campaignsArray.map((campaign) => {
        if (campaign.campaignID === campaignID) {
          return { ...campaign, isFeatured: true };
        }
        return campaign;
      });

      const docRef = doc(firestore, "CJCampaigns", campaignsID);
      await updateDoc(docRef, { campaigns: updatedCampaignsArray });

      setFeatureLoading(false);
      console.log(`Campaign ${campaignID} successfully updated to featured.`);
    } catch (error) {
      setFeatureLoading(false);
      console.error("Error updating campaign in Firestore:", error);
    }
  };

  const activateCampaign = async (campaignID) => {
    setFeatureLoading(true);
    try {
      const { data, id } = await fetchLatestEntry("CJCampaigns");
      const { campaigns: campaignsArray } = data;

      const updatedCampaignsArray = campaignsArray.map((campaign) => {
        if (campaign.campaignID === campaignID) {
          return { ...campaign, isActive: true };
        }
        return campaign;
      });

      const docRef = doc(firestore, "CJCampaigns", id);
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
      const { data, id } = await fetchLatestEntry("CJCampaigns");
      const { campaigns: campaignsArray } = data;

      const updatedCampaignsArray = campaignsArray.map((campaign) => {
        if (campaign.campaignID === campaignID) {
          return { ...campaign, isActive: false };
        }
        return campaign;
      });

      const docRef = doc(firestore, "CJCampaigns", id);
      await updateDoc(docRef, { campaigns: updatedCampaignsArray });

      setFeatureLoading(false);
      console.log(`Campaign ${campaignID} successfully disabled.`);
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

const AddToFeatureRadio = ({ campaign }) => {
  return (
    <div className="form-check form-switch mt-2 w-100">
      <label
        className="form-check-label"
        htmlFor={`featureSwitch-${campaign.campaignID}`}
      >
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
      <label
        className="form-check-label"
        htmlFor={`brandSwitch-${campaign.campaignID}`}
      >
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
            if(term.details){
              return (<p className="d-flex flex-column" key={termIndex}>
              <div><b>Title: </b>{term.title}</div>
              {<div><b>Detail: </b>{term.details}</div>}
              <hr></hr>
            </p>)
            }})}
      </div>
    </td>
  );
};

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="m-4">
      <p><b>Last updates: </b>{lastUpdated}</p>
      <Button disabled className="mb-3" onClick={() => syncCampaigns()}>
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
            <th>Advertiser URL</th>
            <th>Payout Rate</th>
            <th>Terms</th>
            <th>Action</th>
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
              <td>
                <a
                  href={campaign.advertiserURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {campaign.advertiserURL}
                </a>
              </td>
              <td>{campaign.defaultPayoutRate}%</td>
              <Terms campaign={campaign} />
              <td>
                <AddToFeatureRadio campaign={campaign} />
                <br></br>
                <EnableBrandButton campaign={campaign} />
                <br></br>
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


      {
      showModal && <TermsModal 
        collectionName={"CJCampaigns"}
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

export default CjCampaigns;