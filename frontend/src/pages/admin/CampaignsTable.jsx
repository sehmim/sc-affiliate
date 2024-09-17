import React, { useEffect, useState } from "react";
import { getSyncedCampaigns, triggerImpactCampaignSync } from "../../api/env";
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
import { firestore } from "../../utils/firebase";


export async function fetchLatestEntry(collectionName) {
  try {
    const collectionRef = collection(firestore, collectionName);
    const q = query(collectionRef, orderBy("__name__", "desc"), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    const createdAt = data.createdAt || "";
    return { data, createdAt, id: doc.id };
  } catch (error) {
    console.error("Error fetching the latest entry from Firestore:", error);
    throw new Error("Failed to fetch latest entry");
  }
}



const CampaignsTable = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [featureLoading, setFeatureLoading] = useState({});

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        const { data } =  await fetchLatestEntry("impactCampaignsSynced");

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
      const { campaigns: campaignsArray } = data

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

  const enableCampaign = async (campaignID) => {
    setFeatureLoading(true);
    try {
      const { data, id } = await fetchLatestEntry("impactCampaignsSynced");
      const { campaigns: campaignsArray } = data

      const updatedCampaignsArray = campaignsArray.map((campaign) => {
        if (campaign.campaignID === campaignID) {
          return { ...campaign, isActive: true };
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

  const disableCampaign = async (campaignID) => {
    setFeatureLoading(true);
    try {
      const { data, id } = await fetchLatestEntry("impactCampaignsSynced");
      const { campaigns: campaignsArray } = data

      const updatedCampaignsArray = campaignsArray.map((campaign) => {
        if (campaign.campaignID === campaignID) {
          return { ...campaign, isActive: true };
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
  }

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
      return <Button onClick={()=> enableCampaign(campaign.campaignID)} variant="success" className="mt-2 w-100">Enabled</Button>;
    }

    return <Button onClick={()=> disableCampaign(campaign.campaignID)}  variant="danger" className="mt-2 w-100">Disabled</Button>;
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

export default CampaignsTable;
