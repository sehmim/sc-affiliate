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
import { Button } from "react-bootstrap";
import { firestore } from "../../../utils/firebase";

export async function fetchLatestEntry(collectionName) {
  try {
    const collectionRef = collection(firestore, collectionName);

    // Order by 'createdAt' descending to get the latest entry and limit to 1
    const q = query(collectionRef, orderBy("createdAt", "desc"), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    // Get the first document (which is the latest due to the descending order)
    const doc = snapshot.docs[0];
    const data = doc.data();
    const createdAt = data.createdAt || null;

    return { data, createdAt, id: doc.id };
  } catch (error) {
    console.error("Error fetching the latest entry from Firestore:", error);
    throw new Error("Failed to fetch latest entry");
  }
}

const ImpactCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [featureLoading, setFeatureLoading] = useState({});
  const [editableTerms, setEditableTerms] = useState({}); // State to track editable terms

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        const { data } = await fetchLatestEntry("impactCampaignsSynced");

        setCampaigns(data.campaigns);
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
      const { data, id } = await fetchLatestEntry("impactCampaignsSynced");
      const { campaigns: campaignsArray } = data;

      const updatedCampaignsArray = campaignsArray.map((campaign) => {
        if (campaign.campaignID === campaignID) {
          return { ...campaign, isFeatured: true };
        }
        return campaign;
      });

      const docRef = doc(firestore, "impactCampaignsSynced", id);
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
      const { data, id } = await fetchLatestEntry("impactCampaignsSynced");
      const { campaigns: campaignsArray } = data;

      const updatedCampaignsArray = campaignsArray.map((campaign) => {
        if (campaign.campaignID === campaignID) {
          return { ...campaign, isActive: true };
        }
        return campaign;
      });

      const docRef = doc(firestore, "impactCampaignsSynced", id);
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
      const { data, id } = await fetchLatestEntry("impactCampaignsSynced");
      const { campaigns: campaignsArray } = data;

      const updatedCampaignsArray = campaignsArray.map((campaign) => {
        if (campaign.campaignID === campaignID) {
          return { ...campaign, isActive: false };
        }
        return campaign;
      });

      const docRef = doc(firestore, "impactCampaignsSynced", id);
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

  const saveTerm = async (campaignID, termIndex) => {
    setFeatureLoading(true);
    try {
      const { data, id } = await fetchLatestEntry("impactCampaignsSynced");
      const updatedCampaignsArray = data.campaigns.map((campaign) => {
        if (campaign.campaignID === campaignID) {
          const updatedTerms = [...campaign.terms];
          const editedTerm = editableTerms[campaignID]?.[termIndex];

          if (editedTerm) {
            updatedTerms[termIndex] = {
              ...updatedTerms[termIndex],
              title: editedTerm.title || updatedTerms[termIndex].title,
              details: editedTerm.details || updatedTerms[termIndex].details,
            };
          }

          return { ...campaign, terms: updatedTerms };
        }
        return campaign;
      });

      const docRef = doc(firestore, "impactCampaignsSynced", id);
      await updateDoc(docRef, { campaigns: updatedCampaignsArray });

      setFeatureLoading(false);
      console.log(`Campaign ${campaignID} terms successfully updated.`);
    } catch (error) {
      setFeatureLoading(false);
      console.error("Error updating campaign terms in Firestore:", error);
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
  const [newTerm, setNewTerm] = useState({ title: "", details: "" });

  const handleAddNewTerm = async (campaignID) => {
    if (!newTerm.title || !newTerm.details) return;

    setFeatureLoading(true);
    try {
      const { data, id } = await fetchLatestEntry("impactCampaignsSynced");
      const updatedCampaignsArray = data.campaigns.map((c) => {
        if (c.campaignID === campaignID) {
          return {
            ...c,
            terms: [...c.terms, newTerm], // Add new term to the array
          };
        }
        return c;
      });

      const docRef = doc(firestore, "impactCampaignsSynced", id);
      await updateDoc(docRef, { campaigns: updatedCampaignsArray });

      setNewTerm({ title: "", details: "" });
      setFeatureLoading(false);
      console.log(`New term added to campaign ${campaignID}.`);
    } catch (error) {
      setFeatureLoading(false);
      console.error("Error adding new term to campaign:", error);
    }
  };

  const handleDeleteTerm = async (campaignID, termIndex) => {
    setFeatureLoading(true);
    try {
      const { data, id } = await fetchLatestEntry("impactCampaignsSynced");
      const updatedCampaignsArray = data.campaigns.map((c) => {
        if (c.campaignID === campaignID) {
          const updatedTerms = [...c.terms];
          updatedTerms.splice(termIndex, 1); // Remove term by index

          return { ...c, terms: updatedTerms };
        }
        return c;
      });

      const docRef = doc(firestore, "impactCampaignsSynced", id);
      await updateDoc(docRef, { campaigns: updatedCampaignsArray });

      setFeatureLoading(false);
      console.log(`Term ${termIndex + 1} deleted from campaign ${campaignID}.`);
    } catch (error) {
      setFeatureLoading(false);
      console.error("Error deleting term from campaign:", error);
    }
  };

  return (
    <td>
      <div className="d-flex flex-column">
        {campaign.terms.length > 0 &&
          campaign.terms.map((term, termIndex) => (
            <p className="d-flex flex-column" key={termIndex}>
              <div>
                <b>Title:</b>
                <input
                  className="container mb-2 p-1"
                  type="text"
                  value={
                    editableTerms[campaign.campaignID]?.[termIndex]?.title ||
                    term.title
                  }
                  onChange={(e) =>
                    handleEditTerm(
                      campaign.campaignID,
                      termIndex,
                      "title",
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <b>Detail:</b>
                <input
                  className="container mb-2 p-1"
                  type="text"
                  value={
                    editableTerms[campaign.campaignID]?.[termIndex]?.details ||
                    term.details
                  }
                  onChange={(e) =>
                    handleEditTerm(
                      campaign.campaignID,
                      termIndex,
                      "details",
                      e.target.value
                    )
                  }
                />
              </div>
              <Button
                className="mt-2"
                onClick={() => saveTerm(campaign.campaignID, termIndex)}
              >
                Save
              </Button>
              <Button
                variant="danger"
                className="mt-2"
                onClick={() => handleDeleteTerm(campaign.campaignID, termIndex)}
              >
                Delete
              </Button>
              <hr></hr>
            </p>
          ))}
      </div>
      {/* Add New Term */}
      <div className="d-flex flex-column">
        <h5>Add New Term</h5>
        <input
          type="text"
          className="container mb-2"
          placeholder="Title"
          value={newTerm.title}
          onChange={(e) => setNewTerm({ ...newTerm, title: e.target.value })}
        />
        <input
          className="container"
          type="text"
          placeholder="Details"
          value={newTerm.details}
          onChange={(e) => setNewTerm({ ...newTerm, details: e.target.value })}
        />
        <Button
          className="mt-2"
          onClick={() => handleAddNewTerm(campaign.campaignID)}
        >
          Add Term
        </Button>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImpactCampaigns;
