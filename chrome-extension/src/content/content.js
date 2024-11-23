import { createTermsAndServiceDiv, hasMultipleTerms } from "./terms";
import { isMainDomain, ensureHttps } from "./domainChecker";
import { getCookie, setCookie, getQueryParameter, saveClickIdToCookie} from "../utils/cookieHelpers";

import { LOCAL_ENV } from "../utils/env";
import { applyImpactAffiliateLink, applyAwinDeepLink, applyRakutenDeepLink, fetchCampaigns, applyCJDeepLink } from "./apiCalls";
import { applyGoogleSearchDiscounts } from "./googleSearchScreen";
import { getDataFromStorage, getUserSettingsFromPopup, getUserSettingsFromGoogleSearch, sendDataToContentScript } from "./chromeCommunication";

const SPONSOR_CIRCLE_ICON = "https://i.imgur.com/Oj6PnUe.png";
export const COMMISSION_RATE = 1;

function getAllowedBrandInfo(campaigns) {
  const currentWebsiteUrl = window.location.hostname;
  let resultCampaign = null;
  let resultSubDomain = null;

  for (let i = 0; i < campaigns.length; i++) {
    if (resultCampaign) {
      return {
        allowedBrand: resultCampaign,
        allowedSubDomain: resultSubDomain,
      }
    }

    const campaign = campaigns[i];
    const fullUrl = ensureHttps(campaign.advertiserURL);
    const urlHostname = new URL(fullUrl).hostname;
    
    // Check if window hostname matches campain hostname  
    const domainMatched = isMainDomain(currentWebsiteUrl, urlHostname);
    if (domainMatched) {
      return {
        allowedBrand: campaign,
        allowedSubDomain: null,
      }
    }

    // Otherwiese check if window hostname matches campain's subdomain's hostname  
    const allowedSubDomains = campaign.subDomains;
    allowedSubDomains.forEach((allowedSubDomain)=> {
      const fullUrl = ensureHttps(allowedSubDomain);
      const allowedSubDomainHostname = new URL(fullUrl).hostname;

      const domainMatched = isMainDomain(currentWebsiteUrl, allowedSubDomainHostname);

      if (domainMatched) {
        resultCampaign = campaign;
        resultSubDomain = allowedSubDomain;
      }
    })

    // If campaign mathces on the last iteration return data
    if (domainMatched && i === campaigns.length -1) {
      return {
        allowedBrand: campaign,
        allowedSubDomain: null,
      }
    }
  }

  return {
        allowedBrand: null,
        allowedSubDomain: null,
      };
}


///////////////////////////// INITIALIZE ////////////////////////////////
export async function initialize() {

  const userSettings = await getDataFromStorage();

  const closedDiv = createClosedDiv();
  document.body.appendChild(closedDiv);

  const campaigns = await fetchCampaigns();

    // GOOGLE SEARCH
    const isGoogleSearch = window.location.href.includes('https://www.google.com/search') ||
                           window.location.href.includes('https://www.google.ca/search');
    if (isGoogleSearch) {
      if (!userSettings || !userSettings.email) {
        createLoginContainer(closedDiv);
      } else {
        await applyGoogleSearchDiscounts(campaigns, userSettings);
      }

      return;
    }

    // BRAND PAGES
    const { allowedBrand, allowedSubDomain } = getAllowedBrandInfo(campaigns);

    if (!allowedBrand) return;

    if (!userSettings || !userSettings.email) {
      createLoginContainer(closedDiv);
      return
    }
    
    let codeAlreadyAppliedToBrand = await isCodeAlreadyAppliedToWebsite(userSettings.selectedCharityObject.registrationNumber);

    // SHOW APPLIED POPUP
    if (codeAlreadyAppliedToBrand) {
      await createAppliedLinkPageContainer(allowedBrand, closedDiv, userSettings);
    }

    // Regular Affilicate Link Container
    if (!allowedSubDomain && !codeAlreadyAppliedToBrand) {
      await createActivatePageContainer(allowedBrand, closedDiv, userSettings);
    }
}


async function isCodeAlreadyAppliedToWebsite(organizationName) {
    let codeAlreadyAppliedToBrand;
    const href = window.location.href;

    let charityWhereCodeApplied = getCookie("sc-charity");

    // 1. Check if code was applied via the expension popup
    const userSettingsFromPopUp = await getUserSettingsFromPopup();
    if (userSettingsFromPopUp) {
      const charityFromPopup = userSettingsFromPopUp.selectedCharityObject.registrationNumber;

      setCookie("sc-charity", charityFromPopup);
      charityWhereCodeApplied = charityFromPopup
      console.log('settings sc-charity');
    } 

    // 2. Check if code was applied via google search
    const userSettingsFromGoogle = await getUserSettingsFromGoogleSearch();
    if (userSettingsFromGoogle) {
      const charityFromPopup = userSettingsFromGoogle.selectedCharityObject.registrationNumber;


      setCookie("sc-charity", charityFromPopup);
      charityWhereCodeApplied = charityFromPopup
      console.log('settings sc-charity');
    }
    
    // 3. Check cookie not set previously
    if (!charityWhereCodeApplied) {
      return false;
    }

    if (charityWhereCodeApplied && (organizationName.replace(/\s/g, "") !== charityWhereCodeApplied?.replace(/\s/g, ""))) {
      return false
    } 

    console.log('cjdata --->', href.includes("cjdata"))

    const codeInUrl = 
      href.includes("utm_source") || 
      href.includes("irclickid") || 
      href.includes("clickid") || 
      href.includes("ranMID") || 
      href.includes("utm_campaign") || 
      href.includes("awc") || 
      href.includes("cjdata") || 
      href.includes("murl") || 
      href.includes("sc-coupon=activated"); // NOT IN USE

    const validIrclickid = getCookie("sc-irclickid");
    const validClickid = getCookie("sc-clickid");
    const validScCoupon = getCookie("sc-coupon");
    const validranMID = getCookie("sc-ranMID");
    const validranMIDUtmSource = getCookie("sc-utm_source");
    const validAwc = getCookie("sc-awc");
    const validUtmCampaign = getCookie("sc-utm_campaign");
    const validCjdata = getCookie("sc-cjdata");
    const validMurl = getCookie("sc-murl");

    const isValidCookie = 
      validIrclickid || 
      validClickid || 
      validScCoupon || 
      validranMID || 
      validranMIDUtmSource || 
      validUtmCampaign ||
      validCjdata ||
      validMurl || 
      validAwc;

    codeAlreadyAppliedToBrand = codeInUrl || isValidCookie;

    if (codeInUrl && !isValidCookie) {
      saveClickIdToCookie()
    }

    return codeAlreadyAppliedToBrand;
}


// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', applyImpactAffiliateLink);
// }

// function extractUrlFromCite(divElement) {
//     const citeElements = divElement.querySelectorAll('cite');
//     const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

//     for (let cite of citeElements) {
//         const textContent = cite.textContent.trim();
//         if (urlPattern.test(textContent)) {
//             return textContent;
//         }
//     }

//     return null;
// }



///////////////////////////// NEW DESIGN //////////////////////////////////
function createIsolatedIframe(width, height) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('src', 'about:blank'); // Load a blank page initially

  // Add the CSS class
  iframe.classList.add('isolated-iframe');

  // Dynamically set width and height
  iframe.style.width = width;
  iframe.style.height = height;

  // Access the document within the iframe
  const iframeDocument = iframe.contentDocument;

  // If the iframe document is not null
  if (iframeDocument) {
    // Apply some default styles to the iframe content to ensure isolation
    iframeDocument.body.style.margin = '0';
    iframeDocument.body.style.padding = '20px';
    iframeDocument.body.style.fontFamily = 'Arial, sans-serif';
    iframeDocument.body.style.fontSize = '16px';
    iframeDocument.body.style.color = '#333';
  }

  // Trigger the animation after appending
  setTimeout(() => {
    iframe.style.top = '35%'; // Move down to the final position

    let link = iframe.contentDocument.createElement('link');
    link.href = 'https://fonts.cdnfonts.com/css/montserrat';
    link.rel = 'stylesheet';
    iframe.contentDocument.head.appendChild(link);
  }, 0);

  // Return the created iframe
  return iframe;
}


function createClosedDiv() {
  const img = document.createElement('img');

  // Set the src attribute
  img.src = 'https://i.imgur.com/J8IUxyn.png';

  // Apply the styles
  img.style.position = 'fixed';
  img.style.top = '30%';
  img.style.right = '0%';
  img.style.transform = 'translate(-50%, -50%)';
  img.style.width = '50px';
  img.style.height = '50px';
  img.style.border = 'none';
  img.style.backgroundColor = 'rgb(253, 253, 253)';
  img.style.borderRadius = '100%';
  img.style.boxShadow = 'rgba(0, 0, 0, 0.25) 0px 4px 4px 0px';
  img.style.display = 'flex';
  img.style.zIndex = '10000';
  img.style.transition = 'top 0.75s ease-out 0s';
  img.style.cursor = 'pointer';
  img.style.display = 'none';
  img.style.padding = '0';


  // Return the img
  return img;
}

async function createActivatePageContainer(allowedBrand, closedDiv, userSettings){

  const isolatedIframe = createIsolatedIframe('400px', '100px');

  isolatedIframe.onload = async function() {
    const { selectedCharityObject } = userSettings;
    const leftDiv = createLeftDiv(selectedCharityObject);
    const rightDiv = createRightDiv(isolatedIframe, allowedBrand, closedDiv, userSettings);

    const iframeDocument = isolatedIframe.contentDocument || isolatedIframe.contentWindow.document;
    iframeDocument.body.innerHTML = '';
    iframeDocument.body.style.display = 'flex';
    iframeDocument.body.style.margin = '0px';

    iframeDocument.body.appendChild(leftDiv);
    iframeDocument.body.appendChild(rightDiv);
  };
  document.body.appendChild(isolatedIframe);
} 

function createLeftDiv(selectedCharityObject) {
    var div = document.createElement("div");
    div.style.width = "35%";
    div.style.height = "100%";
    div.style.display = "flex"; // Use flexbox
    div.style.alignItems = "center"; // Center the content vertically
    div.style.justifyContent = "center"; // Center the content horizontally
    div.style.flexDirection = "column";
    div.style.background = "#2C0593";

    // Create a div to wrap the first two images
    var imagesWrapper = document.createElement("div");
    imagesWrapper.style.display = "flex"; // Use flexbox
    imagesWrapper.style.flexDirection = "row"; // Arrange images horizontally
    imagesWrapper.style.alignItems = "center"; // Center the images vertically

    // Create the first image
    var image1 = document.createElement("img");
    image1.src = SPONSOR_CIRCLE_ICON;
    image1.style.borderRadius = "8px";
    image1.style.width = "47px";

    // Create the second image
    var image2Wrapper = document.createElement("div");
    image2Wrapper.style.width = "50px";
    image2Wrapper.style.borderRadius = "8px";
    image2Wrapper.style.height = "100%";
    image2Wrapper.style.background = "white";
    image2Wrapper.style.display = "flex";
    image2Wrapper.style.marginLeft = "5px";

    var image2 = document.createElement("img");
    image2.src = selectedCharityObject.logo;
    image2.style.borderRadius = "8px";
    image2.style.width = "37px";
    image2.style.margin = "auto";

    image2Wrapper.appendChild(image2);

    // Append the first two images to the images wrapper div
    imagesWrapper.appendChild(image1);
    imagesWrapper.appendChild(image2Wrapper);

    // Create the third image
    var image3 = document.createElement("img");
    image3.src = "https://i.imgur.com/xobrrSH.png"; // Replace with actual image URL
    image3.style.width = "90%";
    image3.style.paddingTop = "7px";


    // Append the images wrapper and the third image to the left div
    div.appendChild(imagesWrapper);
    div.appendChild(image3);

    return div;
}

function createRightDiv(isolatedIframe, allowedBrand, closedDiv, userSettings) {
    const discountAmount = (allowedBrand.defaultPayoutRate * COMMISSION_RATE)+"%";

    closedDiv.onclick = function () {
      isolatedIframe.style.display = '';
      closedDiv.style.display = 'none';
      setCookie("sc-minimize", false);
    }

    var div = document.createElement("div");
    div.style.width = "65%";
    div.style.height = "100%";
    div.style.display = "flex";

    // Create and append close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '3px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '15px';
    closeButton.style.color = '#333';

    closeButton.onclick = function() {
      setCookie("sc-minimize", true);
      isolatedIframe.style.display = 'none';
      closedDiv.style.display = '';
    };

    div.appendChild(closeButton);

    var button = document.createElement("button");
    button.style.borderRadius = "21px";
    button.style.border = "none";
    button.style.boxShadow = "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px"
    button.style.height = "40px";
    button.style.width = "85%";
    button.style.margin = "auto";
    button.style.cursor = "pointer";
    button.textContent = `Activate to Give ${discountAmount}`;

    // Change background color on hover
    button.addEventListener("mouseenter", function() {
        button.style.background = "rgba(44, 5, 147, 0.21)";
    });

    // Restore default background color when not hovered
    button.addEventListener("mouseleave", function() {
        button.style.background = "#FFF";
    });

    button.onclick = async function() {
        try {
            button.disabled = true;
            button.style.cursor = "not-allowed";
            button.textContent = "Loading...";

            if (allowedBrand.provider === "Impact") {
              const hostName = window.document.location.hostname;
              const redirectionLink = await applyImpactAffiliateLink(allowedBrand, userSettings, hostName)
              window.location.href = "http://" + redirectionLink;
            } 

            if (allowedBrand.provider === "Rakuten"){
              const redirectionLink = await applyRakutenDeepLink(allowedBrand, userSettings)
              window.location.href = redirectionLink;
            }

            if (allowedBrand.provider === "Awin"){
              const redirectionLink = await applyAwinDeepLink(allowedBrand, userSettings)
              window.location.href = redirectionLink.trackingLink;
            }

            if (allowedBrand.provider === "CJ"){
              const redirectionLink = await applyCJDeepLink(allowedBrand, userSettings);
              window.location.href = redirectionLink.trackingLink;
            }

  
            sendDataToContentScript({ userSettingsFromGoogleSearch: null });
            sendDataToContentScript({ userSettingsFromPopup: null });

            setCookie("sc-charity", userSettings.selectedCharityObject.registrationNumber);
            setCookie("sc-minimize", false);

        } catch (error) {
            console.error("Error activating to give:", error);
            button.disabled = true;
            button.textContent = `Merchant not available for this Charity`;
        }
    };

    div.appendChild(button);
    return div;
}


async function createAppliedLinkPageContainer(allowedBrand, closedDiv, userSettings){
  const { selectedCharityObject } = userSettings;

  const frameHeight = hasMultipleTerms(allowedBrand.terms) ? '425px' : '355px';

  const isolatedIframe = createIsolatedIframe('400px', frameHeight);
  isolatedIframe.onload = async function() {
    const navbar = createNavbar(isolatedIframe, closedDiv);
    const middleSection = createMiddleSection(allowedBrand, selectedCharityObject);

    const iframeDocument = isolatedIframe.contentDocument || isolatedIframe.contentWindow.document;
    iframeDocument.body.innerHTML = '';
    iframeDocument.body.style.display = 'flex';
    iframeDocument.body.style.flexDirection = 'column';
    iframeDocument.body.style.margin = '0px';
    iframeDocument.body.style.fontFamily = "Montserrat";

    iframeDocument.body.appendChild(navbar);
    iframeDocument.body.appendChild(middleSection);


    const termsAndService = createTermsAndServiceDiv(allowedBrand);
    iframeDocument.body.appendChild(termsAndService);

  };
  document.body.appendChild(isolatedIframe);

  const isMinimized = getCookie("sc-minimize"); 
  
  if (isMinimized === "true") {
    closedDiv.style.display = 'flex';
    isolatedIframe.style.display = 'none';
  }
}

function createNavbar(isolatedIframe, closedDiv) {
    closedDiv.onclick = function () {
      isolatedIframe.style.display = '';
      closedDiv.style.display = 'none';
      setCookie("sc-minimize", false);
    }

    var div = document.createElement("div");
    div.style.flexDirection = "row";
    div.style.background = "rgb(44, 5, 147)";
    div.style.padding = "10px";
    div.style.alignItems = "center";
    div.style.display = "flex";

    var img1 = document.createElement("img");
    img1.src = "https://i.imgur.com/zbRF4VT.png";
    img1.style.borderRadius = "8px";
    img1.style.width = "20px";
    img1.style.marginRight = "10px";

    var img2 = document.createElement("img");
    img2.src = "https://i.imgur.com/xobrrSH.png";
    img2.style.width = "150px";

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '3px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '15px';
    closeButton.style.color = 'white';
    closeButton.onclick = function() {
      isolatedIframe.style.display = 'none';
      setCookie("sc-minimize", true);
      closedDiv.style.display = '';
    };
    div.appendChild(closeButton);


    div.appendChild(img1);
    div.appendChild(img2);

    return div;
}

function createMiddleSection(allowedBrand, selectedCharityObject) {
    var div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";

    var img = document.createElement("img");
    img.src = selectedCharityObject.logo;
    img.style.width = "51.324px";
    img.style.height = "49px";
    img.style.margin = "20px";
    img.style.padding = "10px";
    img.style.borderRadius = "10px";
    img.style.boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.25)';


    var h1 = document.createElement("h1");
    h1.textContent = "Offer Activated!";
    h1.style.marginTop = "0px";
    h1.style.fontFamily = "Montserrat";
    h1.style.fontSize = "18px";
    h1.style.fontStyle = "normal";
    h1.style.fontWeight = "600";


    var p = document.createElement("p");
    p.textContent = `Your purchases will now give up to ${allowedBrand.defaultPayoutRate * COMMISSION_RATE}% to \n` + selectedCharityObject.organizationName;
    p.style.textAlign = "center";
    p.style.margin = "0px";
    p.style.fontFamily = "Montserrat";
    p.style.fontSize = "14px";
    p.style.fontStyle = "normal";
    p.style.fontWeight = "400";
    p.style.lineHeight = "normal";
    p.style.padding = "0px 20px";

    div.appendChild(img);
    div.appendChild(h1);
    div.appendChild(p);

    return div;
}

function createLoginMiddleSection() {
    var div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";

    var img = document.createElement("img");
    img.src = SPONSOR_CIRCLE_ICON;
    img.style.width = "51.324px";
    img.style.height = "49px";
    img.style.margin = "20px";
    img.style.padding = "10px";
    img.style.borderRadius = "10px";
    img.style.boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.25)';


    var h1 = document.createElement("h1");
    h1.textContent = "Welcome! You’re almost there";
    h1.style.margin = "0px";
    h1.style.fontFamily = "Montserrat";
    h1.style.fontSize = "18px";
    h1.style.fontStyle = "normal";
    h1.style.fontWeight = "600";

    var p = document.createElement("p");
    p.textContent = `Click the “Get Started” button, register, and select your favourite charity. Then, begin shopping!`
    p.style.textAlign = "center";
    p.style.marginBottom = "15px";
    p.style.fontFamily = "Montserrat";
    p.style.fontSize = "14px";
    p.style.fontStyle = "normal";
    p.style.fontWeight = "400";
    p.style.lineHeight = "normal";
    p.style.padding = "0px 20px";

    var button = document.createElement("a");
    button.style.borderRadius = "21px";
    button.style.border = "1px solid rgb(0, 0, 0)";
    button.style.height = "40px";
    button.style.width = "50%";
    button.style.margin = "auto";
    button.style.cursor = "pointer";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.textDecoration = "solid";
    button.textContent = `Get Started`;
    button.target = "_blank"; 
    button.href = LOCAL_ENV ? `https://localhost:3000/onboard?extensionId=${chrome.runtime.id}` : `https://sc-affiliate.vercel.app/onboard?extensionId=${chrome.runtime.id}`; 

    div.appendChild(img);
    div.appendChild(h1);
    div.appendChild(p);
    div.appendChild(button);

    return div;
}

///////////////////// COUPON CODE ////////////////////////////
async function createLoginContainer(closedDiv) {
  const isolatedIframe = createIsolatedIframe('400px', '330px');
  isolatedIframe.onload = async function() {
    const navbar = createNavbar(isolatedIframe, closedDiv);
    const middleSection = createLoginMiddleSection();

    const iframeDocument = isolatedIframe.contentDocument || isolatedIframe.contentWindow.document;
    iframeDocument.body.innerHTML = '';
    iframeDocument.body.style.display = 'flex';
    iframeDocument.body.style.flexDirection = 'column';
    iframeDocument.body.style.margin = '0px';
    iframeDocument.body.style.fontFamily = "Montserrat";

    iframeDocument.body.appendChild(navbar);
    iframeDocument.body.appendChild(middleSection);
  };
  document.body.appendChild(isolatedIframe);

  const isMinimized = getCookie("sc-minimize"); 
  
  if (isMinimized === "true") {
    closedDiv.style.display = 'flex';
    isolatedIframe.style.display = 'none';
  }
}