import { collection, query, orderBy, limit, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestore } from './firebase';



export function reorderCampaigns(campaigns) {
  // Separate the active and inactive campaigns
  const activeCampaigns = campaigns.filter(
    (campaign) => campaign.isActive && parseFloat(campaign.defaultPayoutRate) > 0
  );

  const inactiveCampaigns = campaigns.filter(
    (campaign) => !campaign.isActive || parseFloat(campaign.defaultPayoutRate) === 0
  );

  // Combine active campaigns at the top followed by inactive campaigns
  const sortedCampaigns = [...activeCampaigns, ...inactiveCampaigns];

  return {
    campaigns: sortedCampaigns,
    numberOfInactiveCampaigns: inactiveCampaigns.length,
    numberOfActiveCampaigns: activeCampaigns.length,
  };
}

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


export function formatToHumanReadable(dateString) {
  const date = new Date(dateString);

  // Options to format the date into a human-readable string
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true, // Use 12-hour format (AM/PM)
  };

  // Convert the date to a human-readable string
  return date.toLocaleDateString('en-US', options);
}

export function ensureHttps(url) {
  if (!/^https?:\/\//i.test(url)) {
    // If not, prepend 'https://'
    url = `https://${url}`;
  }
  return url;
}