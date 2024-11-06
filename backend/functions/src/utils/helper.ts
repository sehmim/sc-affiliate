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
    const updatedArray: Campaign[] = [];
    
    newArray.map(newCampaign => {
        // Find campaigns that have matching campaignIDs
        const previousCampaigns = previousArray.filter(
            prev => prev.campaignID+"" === newCampaign.campaignID+""
        );

        if (previousCampaigns.length > 0) {
          previousCampaigns.map((previousCampaign)=> {
              // If added manually just copy it from the previous entry
              if (previousCampaign?.isManuallyEnteredInFirestore) {
                updatedArray.push(previousCampaign);
                return;
              }
              
              updatedArray.push({
                  ...newCampaign,
                  campaignLogoURI: previousCampaign.campaignLogoURI,
                  subDomains: [...new Set(previousCampaign.subDomains)],
                  isActive: previousCampaign.isActive,
                  isFeatured: previousCampaign.isFeatured,
                  terms: previousCampaign.terms,
                  isDeepLinkEnabled: !!previousCampaign.isDeepLinkEnabled
              })
          }) 
        } else {
          // Return the new campaign as-is if no match was found
          updatedArray.push(newCampaign); 
        }
    });

    return updatedArray;
}