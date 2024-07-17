const LOCAL_ENV = false;
const SPONSOR_CIRCLE_ICON = "https://i.imgur.com/Oj6PnUe.png";
const COMMISSION_RATE = 1;
// const DOMAINS = [
//   'https://www.adidas.com.au',
//   'https://anthologybrands.com',
//   'https://www.decathlon.ca',
//   'https://www.easyship.com/',
//   'https://www.fanatics.com',
//   'https://www.impact.com',
//   'https://internationalopenacademy.com',
//   'https://www.invideo.io',
//   'https://livwellnutrition.com',
//   'https://lumierehairs.com',
//   'https://www.marks.com',
//   'https://www.moosejaw.com/',
//   'https://packedwithpurpose.gifts',
//   'https://atlasvpn.com',
//   'https://www.points.com',
//   'https://www.prohockeylife.com/',
//   'https://www.springfreetrampoline.com',
//   'https://us.cocoandeve.com',
//   'https://www.sandandsky.com',
//   'https://www.curiositybox.com/',
//   'https://www.ravpower.com',
//   'https://wish.com',
//   'https://lacoutts.com/'
// ];

///////////////////////////////////
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sendData") {
    console.log("Data received in content script:", message.data);
  }
});

function getDataFromStorage() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("userSettings", function(data) {
            console.log("data ->", data);
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve(data.userSettings);
            }
        });
    });
}

////////////////////////////////////
async function fetchDataFromServer(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Propagate the error to the caller if needed
  }
}

function isGoogle(url) {
    // Use a regular expression to match "http(s)://www.google." followed by any characters
    const pattern = /^https?:\/\/www\.google\.\w+/i;
    return pattern.test(url);
}

function isMainDomain(currentUrl, mainDomain) {
    function extractMainDomain(url) {
        let domain = url.replace(/(https?:\/\/)?(www\.)?/, '');
        domain = domain.split('/')[0];
        let parts = domain.split('.');
        return parts.slice(0, -1).join('.');
    }

    // Extract main parts of the domains from both URLs
    let mainPartCurrent = extractMainDomain(currentUrl);
    let mainPartMain = extractMainDomain(mainDomain);

    // Check if the main parts match
    return mainPartCurrent === mainPartMain;
}

//////////////////////////////////////
function handleApplyCouponCodeOnCheckout(couponCode, isolatedIframe){
  let discountInput = 
    document.querySelector('input[aria-label="Discount code"]') 
    || document.querySelector('input[placeholder="Discount code"]');

  // Check if the input element exists
  if (discountInput) {
    discountInput.focus();
    discountInput.value = couponCode;

    // Trigger an input event to simulate user input
    const inputEvent = new Event('input', { bubbles: true });
    discountInput.dispatchEvent(inputEvent);

  } else {
    console.log("CANT FIND INPUT FIELD")
  }

    setTimeout(() => {
      let applyButton = document.querySelector('button[aria-label="Apply Discount Code"]');

      // Check if the button element exists
      if (applyButton) {
        // Simulate a click event on the button
        applyButton.click();
        isolatedIframe.style.display = 'none';
        // maindDiv.style.display = 'none';
      } else {
        console.error('Button with aria-label "Apply Discount Code" not found.');
      }
    }, 300);
  }


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
    const urlHostname = new URL(campaign.advertiserURL).hostname;
    
    // Check if window hostname matches campain hostname  
    if (isMainDomain(currentWebsiteUrl, urlHostname)) {
      return {
        allowedBrand: campaign,
        allowedSubDomain: null,
      }
    }

    // Otherwiese check if window hostname matches campain's subdomain's hostname  
    const allowedSubDomains = campaign.subDomains;
    allowedSubDomains.forEach((allowedSubDomain)=> {
      const allowedSubDomainHostname = new URL(allowedSubDomain).hostname;

      if (isMainDomain(currentWebsiteUrl, allowedSubDomainHostname)) {
        resultCampaign = campaign;
        resultSubDomain = allowedSubDomain;
      }
    })
  }

  return {
        allowedBrand: null,
        allowedSubDomain: null,
      };
}


function isCouponedWebsiteCheckout() {
  // const COUPONED_BRANDS = ["lacoutts.com", "softstrokessilk.com", "lavenderpolo.com"]
  let couponInfo = null;
  const href = window.location.href;

  if (href.includes("https://lacoutts.com/checkouts")) {
    couponInfo = {
      brand: "lacoutts.com",
      couponCode: "LaCouttsSC20",
      amount: "20%"
    }
  } else if (href.includes("https://www.softstrokessilk.com/checkouts")) {
    couponInfo = {
      brand: "softstrokessilk.com",
      couponCode: "LOVESILK",
      amount: "10%"
    }
  } 

  return couponInfo;
}

function isCouponedWebsite(domain) {
  let couponInfo = null;
  const href = new URL(domain).href;

  if (href.includes("https://lacoutts.com")) {
    couponInfo = {
      brand: "lacoutts.com",
      couponCode: "LaCouttsSC20",
      amount: "20%"
    }
  } else if (href.includes("https://www.softstrokessilk.com")) {
    couponInfo = {
      brand: "softstrokessilk.com",
      couponCode: "LOVESILK",
      amount: "10%"
    }
  } 

  return couponInfo;
}

///////////////////////////// INITIALIZE ////////////////////////////////
async function initialize() {

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
        return
      }
      await applyGoogleSearchDiscounts(campaigns);
      return;
    }

    // BRAND PAGES
    const { allowedBrand, allowedSubDomain } = getAllowedBrandInfo(campaigns);
    
    if (!allowedBrand) return;

    if (!userSettings || !userSettings.email) {
      createLoginContainer(closedDiv);
      return
    }
    
    let codeAlreadyAppliedToBrand = isCodeAlreadyAppliedToWebsite();

    // Coupon Container
    const couponInfo = isCouponedWebsiteCheckout();
    if (couponInfo) {
      await createApplyCouponCodeContainer(couponInfo, closedDiv, allowedBrand, userSettings?.selectedCharityObject);
    } else {
      // SHOW APPLIED POPUP
      if (codeAlreadyAppliedToBrand) {
        await createAppliedLinkPageContainer(allowedBrand, closedDiv, userSettings?.selectedCharityObject);
      }

      // Regular Affilicate Link Container
      if (!couponInfo && !allowedSubDomain && !codeAlreadyAppliedToBrand) {
        await createActivatePageContainer(allowedBrand, closedDiv, userSettings?.selectedCharityObject);
      }
    }
}


initialize().then(() => {
  console.log("INITIALZIED")
});



function isCodeAlreadyAppliedToWebsite() {
    let codeAlreadyAppliedToBrand;
    const href = window.location.href;
    const codeInUrl = href.includes("irclickid") || href.includes("clickid") || href.includes("sc-coupon=activated");
    
    const validIrclickid = getCookie("sc-irclickid");
    const validClickid = getCookie("sc-clickid");
    const validScCoupon = getCookie("sc-coupon");

    const isValidCookie = validIrclickid || validClickid || validScCoupon;

    codeAlreadyAppliedToBrand = codeInUrl || isValidCookie;

    if (codeInUrl && !isValidCookie) {
      saveClickIdToCookie()
    }

    return codeAlreadyAppliedToBrand;
}

async function applyAffiliateLink(allowedBrand, selectedCharityObject){
  // if (selectedTeam === "------Your Teams-----" || selectedTeam === "-----Default Charities-----") {
  //   alert("PICK A TEAM");
  //   return
  // }

  const programId = allowedBrand.campaignID;
  const url = LOCAL_ENV ? `http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/applyTrackingLink?programId=${programId}&teamName=${selectedCharityObject?.organizationName}` 
      : `https://applytrackinglink-6n7me4jtka-uc.a.run.app?programId=${programId}&teamName=${selectedCharityObject?.organizationName}`;

  // const data = await fetchDataFromServer(url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    window.location.href = "http://" + responseData;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Propagate the error to the caller if needed
  }
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyImpactLink);
}

async function fetchCampaigns() {
  const url = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getCampaigns" : "https://getcampaigns-6n7me4jtka-uc.a.run.app"; 
  return await fetchDataFromServer(url) || [];
}

function extractUrlFromCite(divElement) {
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


function applyGoogleSearchDiscounts(campaigns) {
  const searchResults = document.querySelectorAll('div.g');

  searchResults.forEach(result => {
    const href = result.querySelector('a[href^="http"]')?.href;
    const url = href || extractUrlFromCite(result);

    if (!url) return;

    const domain = new URL(url).hostname;

    campaigns.map(campaign => {
      const allowedDomain = new URL(campaign.advertiserURL).hostname;
      const percentage = (campaign.discountPercentage * COMMISSION_RATE) + "%";

      if (!isMainDomain(domain, allowedDomain)) {
        const allowedSubDomains = campaign.subDomains;

        if (!allowedSubDomains || allowedSubDomains.length === 0) return;

        let matched = false;
        allowedSubDomains.forEach(allowedSubDomain => {
          const allowedDomainHostname = new URL(allowedSubDomain).hostname;
          if (isMainDomain(domain, allowedDomainHostname)) {
            matched = true;
          }
        });
        if (!matched) return;
      }

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
      textDiv.href = campaign.trackingLink;
      textDiv.target = "_blank";

      mainDiv.appendChild(logoDiv);
      mainDiv.appendChild(textDiv);

      result.insertBefore(mainDiv, result.firstChild);
      return
    });
  });
}




///////////////////////////// NEW DESIGN //////////////////////////////////
function createIsolatedIframe(width, height) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('src', 'about:blank'); // Load a blank page initially

  // Set initial inline styles for the iframe
  iframe.style.position = 'fixed';
  iframe.style.top = '-100%'; // Start from above the viewport
  iframe.style.left = '85%';
  iframe.style.transform = 'translate(-50%, -50%)';
  iframe.style.width = width;
  iframe.style.height = height;
  iframe.style.border = 'none';
  iframe.style.backgroundColor = '#FDFDFD';
  iframe.style.borderRadius = '16px';
  iframe.style.boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.25)';
  iframe.style.display = 'flex';
  iframe.style.zIndex = 20000;
  iframe.style.transition = 'top 0.75s ease-out'; // Animation for moving down

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
  img.src = 'https://i.imgur.com/Oj6PnUe.png';

  // Apply the styles
  img.style.position = 'fixed';
  img.style.bottom = '0%';
  img.style.left = '3%';
  img.style.transform = 'translate(-50%, -50%)';
  img.style.width = '50px';
  img.style.height = '50px';
  img.style.border = 'none';
  img.style.backgroundColor = 'rgb(253, 253, 253)';
  img.style.borderRadius = '16px';
  img.style.boxShadow = 'rgba(0, 0, 0, 0.25) 0px 4px 4px 0px';
  img.style.display = 'flex';
  img.style.zIndex = '10000';
  img.style.transition = 'top 0.75s ease-out 0s';
  img.style.cursor = 'pointer';
  img.style.display = 'none';


  // Return the img
  return img;
}


async function createActivatePageContainer(allowedBrand, closedDiv, selectedCharityObject){

  const isolatedIframe = createIsolatedIframe('400px', '100px');

  isolatedIframe.onload = async function() {
    const leftDiv = createLeftDiv(selectedCharityObject);
    const rightDiv = createRightDiv(isolatedIframe, allowedBrand, undefined, closedDiv, selectedCharityObject);

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

function createRightDiv(isolatedIframe, allowedBrand, couponInfo, closedDiv, selectedCharityObject) {
    const discountAmount = couponInfo ? couponInfo?.amount : (allowedBrand.discountPercentage * COMMISSION_RATE)+"%";

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
    button.style.border = "1px solid rgb(0, 0, 0)";
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
            // Disable the button and show loading text
            button.disabled = true;
            button.style.cursor = "not-allowed";
            button.textContent = "Loading...";

            if (allowedBrand && allowedBrand.discountType === "Coupon") {
              if (isCouponedWebsiteCheckout()) {
                await handleApplyCouponCodeOnCheckout(couponInfo?.couponCode, isolatedIframe);
              } else {
                window.location.href = allowedBrand.trackingLink;
              }
            } else {
              await applyAffiliateLink(allowedBrand, selectedCharityObject);
            }
  
            setCookie("sc-minimize", false);

        } catch (error) {
            console.error("Error activating to give:", error);
        } finally {
          // Re-enable the button and restore the original text
          button.disabled = false;
          button.style.cursor = "pointer";
          button.textContent = `Activate to Give ${discountAmount}`;
      }
    };

    div.appendChild(button);

    return div;
}


async function createAppliedLinkPageContainer(allowedBrand, closedDiv, selectedCharityObject){
  const isolatedIframe = createIsolatedIframe('400px', '280px');
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
    p.textContent = `Your purchases will now give up to ${allowedBrand.discountPercentage * COMMISSION_RATE}% to \n` + selectedCharityObject.organizationName;
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

async function createApplyCouponCodeContainer(couponInfo, closedDiv, allowedBrand, selectedCharityObject){
  const isolatedIframe = createIsolatedIframe('400px', '100px');
  isolatedIframe.onload = async function() {
    const leftDiv = createLeftDiv(selectedCharityObject);
    const rightDiv = createRightDiv(isolatedIframe, allowedBrand, couponInfo, closedDiv, selectedCharityObject);

    const iframeDocument = isolatedIframe.contentDocument || isolatedIframe.contentWindow.document;
    iframeDocument.body.innerHTML = '';
    iframeDocument.body.style.display = 'flex';
    iframeDocument.body.style.margin = '0px';

    iframeDocument.body.appendChild(leftDiv);
    iframeDocument.body.appendChild(rightDiv);
  };
  document.body.appendChild(isolatedIframe);
}


/////////// COOKIES /////////////
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function saveClickIdToCookie() {
  const irclickid = getQueryParameter("irclickid");
  const clickid = getQueryParameter("clickid");
  const scCoupon = getQueryParameter("sc-coupon");

  if (irclickid) {
      setCookie("sc-irclickid", irclickid, 7);
  }

  if (clickid) {
      setCookie("sc-clickid", clickid, 7);
  }

  if (scCoupon && scCoupon === "activated") {
      setCookie("sc-coupon", scCoupon, 7);
  }
}