const EXCEPTIONAL_DOMAINS = ['ca.trip.com', 'www.cocoandeve.com'];

export function isMainDomain(currentUrlInput, campaignDomain) {
    const currentUrl = new URL(ensureHttps(currentUrlInput)).hostname;

    if (EXCEPTIONAL_DOMAINS.includes(currentUrl)) {
        return true;
    }

    function extractMainDomain(url) {
        let domain = url.replace(/(https?:\/\/)?(www\.)?/, '');
        domain = domain.split('/')[0];
        let parts = domain.split('.');
        return parts.slice(0, -1).join('.');
    }

    // Extract main parts of the domains from both URLs
    let extractedCurrecntUrl = extractMainDomain(currentUrl);
    let extractedCampaignDomain = extractMainDomain(campaignDomain);

    // Check if the main parts match
    return extractedCurrecntUrl === extractedCampaignDomain;
}

export function ensureHttps(url) {
  // Check if the URL starts with 'http://' or 'https://'
  if (!/^https?:\/\//i.test(url)) {
    // If not, prepend 'https://'
    url = `https://${url}`;
  }
  return url;
}