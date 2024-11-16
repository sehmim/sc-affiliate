import { Charity, UserSettings, Campaign } from "../types/types";
import { COMMISSION_RATE } from "../utils/consts";
import { applyAwinDeepLink, applyCJDeepLink, applyImpactAffiliateLink, applyRakutenDeepLink, collectAndSendBrowserInfo } from "./apiCalls";
import { ensureHttps, isMainDomain } from "./domainChecker";


export async function applyGoogleSearchDiscounts(campaigns: Campaign[], userSettings: UserSettings) {
  await applyBoostedAd();
  const searchResults = document.querySelectorAll('div.g');

  searchResults.forEach(result => {
    const href = (result.querySelector('a[href^="http"]') as any);
    const url = href || extractUrlFromCite(result);

    if (!url) return;

    const domain = new URL(url).hostname;

    campaigns.map(campaign => {
      const fullUrl = ensureHttps(campaign.advertiserURL);
      const allowedDomain = new URL(fullUrl).hostname;
      const percentage = (Number(campaign.defaultPayoutRate) * COMMISSION_RATE) + "%";

      // If the Url isnt in allowed domain skip html injection
      if (!isMainDomain(domain, allowedDomain)) return;

      const mainDiv = document.createElement('div');
      mainDiv.style.color = '#1a0dab';
      mainDiv.style.background = '#eeeeee';
      mainDiv.style.fontSize = '14px';
      mainDiv.style.lineHeight = '27px';
      mainDiv.style.height = '37px';
      mainDiv.style.margin = '0 0 7px 0';
      mainDiv.style.padding = '6px 0 0 8px';
      mainDiv.style.boxSizing = 'border-box';
      mainDiv.style.width = '100%';
      mainDiv.style.borderRadius = '5px';
      mainDiv.style.fontFamily = "'Cerebri Sans', sans-serif";
      mainDiv.style.minWidth = '542px';
      mainDiv.style.cursor = 'pointer';

      const logoDiv = document.createElement('div');
      logoDiv.style.width = '33px';
      logoDiv.style.height = '25px';
      logoDiv.style.float = 'left';
      logoDiv.style.background = "url(https://i.imgur.com/GDbtHnR.png) no-repeat";
      logoDiv.style.backgroundSize = 'contain';

      const textDiv = document.createElement('a');
      textDiv.style.whiteSpace = 'nowrap';
      textDiv.textContent = `Give ${percentage} to your cause 💜`;
      textDiv.target = "_blank";
      textDiv.onclick = async function () {
        if (campaign.provider === "Impact") {
          const redirectionLink = await applyImpactAffiliateLink(campaign, userSettings)
          window.location.href = ensureHttps(redirectionLink);
        } 

        if (campaign.provider === "Rakuten"){
          const redirectionLink = await applyRakutenDeepLink(campaign, userSettings)
          window.location.href = redirectionLink;
        } 

        if (campaign.provider === "Awin"){
          const redirectionLink = await applyAwinDeepLink(campaign, userSettings)
          window.location.href = redirectionLink;
        }

        if (campaign.provider === "CJ"){
          const redirectionLink = await applyCJDeepLink(campaign, userSettings)
          window.location.href = redirectionLink;
        }

        sendDataToContentScript({ userSettingsFromGoogleSearch: userSettings });
        sendDataToContentScript({ userSettingsFromPopup: null });
      }

      mainDiv.appendChild(logoDiv);
      mainDiv.appendChild(textDiv);

      result.insertBefore(mainDiv, result.firstChild);
      return
    });
  });
}

function extractUrlFromCite(divElement: any) {
    const citeElements = divElement.querySelectorAll('cite');
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

    for (let cite of citeElements) {
        const textContent = cite.textContent.trim();
        if (urlPattern.test(textContent)) {
            return textContent;
        }
    }

    return null;
}

//////////// Boosted Ads ///////////////////
function isSearchQueryBarrie() {
    // Check if the URL contains a query parameter with the search term "Barrie"
    const queryParam = new URLSearchParams(window.location.search);
    const query = queryParam.get('q');

    return query && query.toLowerCase().includes('barrie');
}

function boostedAdContainer() {
    // Create the outer container
    const container = document.createElement('div');
    container.className = 'boosted-ad-container';

    // Create the inner content container
    const inner = document.createElement('div');
    inner.className = 'boosted-ad-inner';

    // Create the header section
    const header = document.createElement('div');
    header.className = 'boosted-ad-header';

    // Create the logo container
    const logo = document.createElement('div');
    logo.className = 'boosted-ad-logo';

    // Create and append the logo image
    const logoImg = document.createElement('img');
    logoImg.className = 'boosted-ad-logo-img';
    logoImg.src = 'https://i.imgur.com/JGT9FfJ.png';
    logoImg.alt = 'Busby Centre';
    logo.appendChild(logoImg);

    // Create and append the title
    const title = document.createElement('p');
    title.className = 'boosted-ad-title';
    title.textContent = 'The Busby Centre';
    header.appendChild(logo);
    header.appendChild(title);

    // Create and append the link
    const link = document.createElement('a');
    link.className = 'boosted-ad-link';
    link.target = '_blank';
    link.href = 'https://www.busbycentre.ca';
    link.textContent = 'The Busby Centre | Support Busby Centre today 💜';

    // Create and append the new section
    const additionalSection = document.createElement('div');
    additionalSection.className = 'boosted-ad-additional';

    // Create and append the description paragraph
    const description = document.createElement('p');
    description.className = 'boosted-ad-description';
    description.textContent = 'This advertisement is created by';
    additionalSection.appendChild(description);

    // Create and append the sponsor logo
    const sponsorLogoContainer = document.createElement('div');
    sponsorLogoContainer.className = 'boosted-ad-sponsor-logo';

    const sponsorLogoImg = document.createElement('img');
    sponsorLogoImg.className = 'boosted-ad-sponsor-logo-img';
    sponsorLogoImg.src = 'https://sponsorcircle.com/wp-content/uploads/2021/02/sponsor-circle-black-transparent-1.png';
    sponsorLogoContainer.appendChild(sponsorLogoImg);

    additionalSection.appendChild(sponsorLogoContainer);

    // Append all sections to the inner container
    inner.appendChild(header);
    inner.appendChild(link);

    // Append the inner container to the outer container
    container.appendChild(inner);
    container.appendChild(additionalSection);

    return container;
}

async function applyBoostedAd() {
    const showContainer = isSearchQueryBarrie();

    if (!showContainer) {
      return
    }

    const adContainer = boostedAdContainer();
    // Find the rcnt container
    const centerColContainer = document.getElementById('center_col');

    if (centerColContainer) {
      centerColContainer.insertAdjacentElement('afterbegin', adContainer);
      await collectAndSendBrowserInfo()
    }
}
function sendDataToContentScript(arg0: { userSettingsFromGoogleSearch: UserSettings | null; }) {
    throw new Error("Function not implemented.");
}

