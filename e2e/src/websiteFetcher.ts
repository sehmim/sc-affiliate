const FETCH_URL = 'https://us-central1-sponsorcircle-3f648.cloudfunctions.net/getSyncedCampaigns';

interface Campaign {
  campaignName: string;
  campaignID: string;
  campaignLogoURI: string;
  defaultPayoutRate: string;
  advertiserURL: string;
  subDomains: string[];
  provider: string;
  isActive: boolean;
  isFeatured: boolean;
  terms: Array<{ title: string; details: string }>;
  isDeepLinkEnabled: boolean;
  categories: string[];
}

export async function fetchWebsites(): Promise<string[]> {
  const response = await fetch(FETCH_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch campaigns: ${response.statusText}`);
  }

  const campaigns: Campaign[] = await response.json();
  if (!Array.isArray(campaigns)) {
    throw new Error('Invalid response format: Expected an array of campaigns.');
  }

  const websites = campaigns
    .map((campaign) => campaign.advertiserURL)
    .filter((url): url is string => typeof url === 'string' && url.trim() !== '');

  return websites;
}
