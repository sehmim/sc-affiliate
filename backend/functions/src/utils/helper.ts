import { Campaign } from "../controllers/campagins/Campaigns";

export function sortBy(key: any, array: any) {
  return array.slice().sort((a: any, b: any) => {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  });
}

export function extractNumber(input: string) {
  const match = input.match(/(\d+)%/); // Find digits before the '%' sign
  return match ? Number(match[1]) : null; // Convert the matched digits to a number
}

export function ensureHttps(url: string) {
  if (!/^https?:\/\//i.test(url)) {
    // If not, prepend 'https://'
    url = `https://${url}`;
  }
  return url;
}

export function updateCampaignArray(
    previousArray: Campaign[], 
    newArray: Campaign[]
): Campaign[] {
    const updatedArray = newArray.map(newCampaign => {
        const previousCampaign = previousArray.find(
            prev => prev.campaignID+"" === newCampaign.campaignID+""
        );

        if (previousCampaign) {
            // Copy non-comparable properties from previousCampaign to newCampaign
            return {
                ...newCampaign,
                isActive: previousCampaign.isActive,
                isFeatured: previousCampaign.isFeatured,
                terms: previousCampaign.terms,
                isDeepLinkEnabled: !!previousCampaign.isDeepLinkEnabled
            };
        }

        // Return the new campaign as-is if no match was found
        return newCampaign;
    });

    return updatedArray;
}