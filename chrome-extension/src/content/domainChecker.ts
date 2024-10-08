export function isMainDomain(currentUrlInput: string, campaignDomain: string) {
    const currentUrl = new URL(ensureHttps(currentUrlInput)).hostname;

    function extractMainDomain(url: string) {
        let domain = url.replace(/(https?:\/\/)?(www\.)?/, '');
        domain = domain.split('/')[0];
        let parts = domain.split('.');
        return parts.slice(0, -1).join('.');
    }

    let extractedCurrecntUrl = extractMainDomain(currentUrl);
    let extractedCampaignDomain = extractMainDomain(campaignDomain);

    // Check if the main parts match
    return extractedCurrecntUrl === extractedCampaignDomain;
}

export function ensureHttps(url: string) {
  if (!/^https?:\/\//i.test(url)) {
    // If not, prepend 'https://'
    url = `https://${url}`;
  }
  return url;
}