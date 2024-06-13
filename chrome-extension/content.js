const LOCAL_ENV = true;
const SELECTED_TEAM = '(A.C.C.E.S.) ACCESSIBLE COMMUNITY COUNSELLING AND EMPLOYMENT SERVICES'
const COMMISSION_RATE = 0.50;
const DOMAINS = [
  'https://www.adidas.com.au',
  'https://anthologybrands.com',
  'https://www.decathlon.ca',
  'https://www.easyship.com/',
  'https://www.fanatics.com',
  'https://www.impact.com',
  'https://internationalopenacademy.com',
  'https://www.invideo.io',
  'https://livwellnutrition.com',
  'https://lumierehairs.com',
  'https://www.marks.com',
  'https://www.moosejaw.com/',
  'https://packedwithpurpose.gifts',
  'https://atlasvpn.com',
  'https://www.points.com',
  'https://www.prohockeylife.com/',
  'https://www.springfreetrampoline.com',
  'https://us.cocoandeve.com',
  'https://www.sandandsky.com',
  'https://www.curiositybox.com/',
  'https://www.ravpower.com',
  'https://wish.com'
];

///////////////////////////////////
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sendData") {
    console.log("Data received in content script:", message.data);
  }
});

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

function checkCookieExpiration(url, cookieName) {

  if (isGoogle(url)) {
    return
  }

    console.log(`Checking cookie: ${cookieName} for URL: ${url}`); // Debug log
    chrome.runtime.sendMessage({ action: 'checkCookie', url: url, cookieName: cookieName }, function(response) {
        if (response && response.error) {
            console.error(response.error);
        } else if (response && response.expired) {
            console.log("Cookie is expired");
        } else {
            console.log("Cookie is not expired");
        }
    });
}

// Function to create and style the div container
function createDivContainer() {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.width = '400px';
  div.style.top = '60px';
  div.style.right = '20px';
  div.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  div.style.padding = '35px 10px 10px 10px';
  div.style.border = '1px solid #ccc';
  div.style.zIndex = '9999'; // Set a high z-index value
  
  // Create and append close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '10px';
  closeButton.style.backgroundColor = 'transparent';
  closeButton.style.border = 'none';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '20px';
  closeButton.style.color = '#333';
  closeButton.onclick = function() {
    div.style.display = 'none';
  };
  div.appendChild(closeButton);
  
  return div;
}

function createDropdownWithOptions(optionsArray, textContent) {
  var labelElement = document.createElement('label');
  labelElement.textContent = textContent || 'Select your team:';

  var selectElement = document.createElement('select');
  selectElement.id = "selectedTeam";

  optionsArray.forEach(function(optionText) {
    var optionElement = document.createElement('option');
    optionElement.textContent = optionText;
    optionElement.value = optionText;
    selectElement.style.width = "200px";
    selectElement.appendChild(optionElement);
  });

  var containerDiv = document.createElement('div');
  containerDiv.appendChild(labelElement);
  containerDiv.appendChild(selectElement);
  containerDiv.style.display = "flex";
  containerDiv.style.justifyContent = "space-between";

  return { allowedTeamsDropdown: containerDiv, selectElement};
}

function createLoginButton() {
  var loginButton = document.createElement('button');
  loginButton.textContent = 'Login';
  loginButton.style.cursor = 'pointer'; // Make cursor change on hover

  loginButton.addEventListener('click', function() {
    window.location.href = 'https://sponsorcircle-affiliate-git-feature-landingpage-sehmim.vercel.app/login';
  });

  return loginButton;
}

function createLogoutButton() {
  let button = document.createElement('button');
  
  button.textContent = 'Logout';
  button.addEventListener('click', function() {
    localStorage.removeItem('sponsorcircle-useremail');
    window.location.reload();
  });

  return button;
}

//////////////////////////////////////
function handleApplyCouponCode(couponCode, isolatedIframe){
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

function handleApplyCouponCodeForLavenderPolo(couponCode, isolatedIframe) {
  
}

async function fetchAllowedGroups(userEmail) {
  const url = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getAllGroups" : "https://getallgroups-6n7me4jtka-uc.a.run.app";
  const groups = await fetchDataFromServer(url);

  return groups.filter((group) => {
    const isLeader = group.leader.email === userEmail;
    const isMember = group.members.some(member => member.email === userEmail);
    
    if (isLeader || isMember) {
      return true;
    } else {
      return false;
    }
  }).map(group => group.teamName);
}

async function fetchDefaultCharaties() {
  const url = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getDefaultCharities" : "https://getdefaultcharities-6n7me4jtka-uc.a.run.app";
  const charities = await fetchDataFromServer(url);

  return charities.map(({ data }) => {
    return data.organizationName;
  })
}

function getAllowedBrandInfo(campaigns) {
  const currentWebsiteUrl = window.location.origin;

  for (let i = 0; i < campaigns.length; i++) {
    const campaign = campaigns[i];
    const urlHostname = new URL(campaign.advertiserURL);

    if (currentWebsiteUrl.includes(urlHostname.origin)) {
      return campaign;
    }
  }

  return null;
}

// function getAllowedBrandInfo(allowedDomainsWithIds) {
//   const currentWebsiteUrl = window.location.hostname;

//   for (const [url, id] of Object.entries(allowedDomainsWithIds)) {

//     const urlHostname = new URL(url);
//     if (currentWebsiteUrl.includes(urlHostname.hostname)) {
//       return { url: urlHostname, id };
//     }
//   }

//   return null;
// }

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function isCouponedWebsite() {
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

  // else if(href.includes("https://www.lavenderpolo.com/checkout")){
  //   couponInfo = {
  //     brand: "lavenderpolo.com",
  //     couponCode: "LPOLO",
  //     amount: "10%"
  //   }
  // }

  return couponInfo;
}

///////////////////////////// INITIALIZE ////////////////////////////////
async function initialize() {

  const closedDiv = createClosedDiv();
  document.body.appendChild(closedDiv);

  // If Couponsed Website show coupon view
  const couponInfo = isCouponedWebsite();
  if (couponInfo) {
    await createApplyCouponCodeContainer(couponInfo, closedDiv);
  } else {
    const campaigns = await fetchCampaigns();

    // GOOGLE SEARCH
    const isGoogleSearch = window.location.href.includes('https://www.google.com/search') || window.location.href.includes('https://www.google.ca/search');

    if (isGoogleSearch) {
      await applyGoogleSearchDiscounts(campaigns);
      return
    }

    // BRAND PAGES
    let isCookieExpired;
    let codeAlreadyAppliedToURL;
    const allowedBrand = getAllowedBrandInfo(campaigns);

    if (allowedBrand) {
      isCookieExpired = await checkCookieExpiration(window.location.origin, "irclickid");
      codeAlreadyAppliedToURL = window.location.href.includes("irclickid") || window.location.href.includes("clickid");
    }

    if ((allowedBrand && !codeAlreadyAppliedToURL && !isCookieExpired)) {
      await createActivatePageContainer(allowedBrand, closedDiv);
    }

    if (allowedBrand && codeAlreadyAppliedToURL) {
      await createAppliedLinkPageContainer(allowedBrand, closedDiv);
    }

  }

  // if (matchedDomain && matchedDomain?.couponCode) {
  //   if (window.location.href.includes("checkouts")) {
  //     const div = createDivContainer();

  //     // const dropdown = createDropdownWithOptions(allowedTeams);

  //     const button = createButton();
  //     button.addEventListener('click', () => handleApplyCouponCode(matchedDomain.couponCode, div));

  //     // div.appendChild(dropdown);
  //     div.appendChild(button);
  //     document.body.appendChild(div);
  //   }
  // } else {
  //   const appliedURL = window.location.href.includes("irclickid");
  //   if (matchedDomain && !appliedURL) {
  //     const div = createDivContainer();
      
  //     const dropdown = createDropdownWithOptions(allowedTeams);
      
  //     const button = createButton();
  //     button.addEventListener('click', () => handleButtonClick(matchedDomain.affiliateLink));
      
  //     div.appendChild(dropdown);
  //     div.appendChild(button);
  //     document.body.appendChild(div);
  //   }
  // }
}

function getUserInfo() {

  console.log("chrome ----->", chrome);
  // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //   const activeTab = tabs[0];
  //   chrome.tabs.sendMessage(activeTab.id, { type: 'USER_EMAIL', payload: 'user@example.com' });
  // });
}

function greetUser() {
  const userEmail = localStorage.getItem('sponsorcircle-useremail');
  if (userEmail) {
    const div = document.createElement('div');
    div.innerText = `Hello ${userEmail}`;

    return div;
  }
}

initialize().then(() => {
  console.log("INITIALZIED")
});




// TODO: 
function createCloseButton(iframe) {
    const closeButton = document.createElement('div');
    closeButton.innerHTML = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.padding = '5px';
    closeButton.style.backgroundColor = 'red';
    closeButton.style.color = 'white';
    closeButton.addEventListener('click', function() {
        iframe.style.display = 'none'; // Hide the iframe when close button is clicked
    });
    return closeButton;
}


function generateLoginForm() {
  // Create form element
  const form = document.createElement('form');

  // Create header
  const header = document.createElement('div');
  header.innerText = "LOGIN";

  // Create email input
  const emailInput = document.createElement('input');
  emailInput.setAttribute('type', 'email');
  emailInput.setAttribute('placeholder', 'Email');
  emailInput.setAttribute('name', 'email');
  
  // Create password input
  const passwordInput = document.createElement('input');
  passwordInput.setAttribute('type', 'password');
  passwordInput.setAttribute('placeholder', 'Password');
  passwordInput.setAttribute('name', 'password');
  
  // Create submit button
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  
  // Add event listener to submit button
  submitButton.addEventListener('click', async function(event) {
      event.preventDefault();
      const email = emailInput.value;
      const password = passwordInput.value;
      await loginUser(email, password);
  });

  // Create Register link
  const register = document.createElement('a');
  register.innerText = "Register";
  register.setAttribute('target','_blank');
  register.href = 'https://sponsorcircle-affiliate.vercel.app/register';

  // Append inputs and button to form
  form.appendChild(header);
  form.appendChild(emailInput);
  form.appendChild(passwordInput);
  form.appendChild(submitButton);
  form.appendChild(register);
  
  return form;
}


async function loginUser(email, password) {
    const url = LOCAL_ENV ? 'http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/loginUser': "https://loginuser-6n7me4jtka-uc.a.run.app";

    const data = {
        email: email,
        password: password
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to login');
        }

        if (response.ok) {
          localStorage.setItem('sponsorcircle-useremail', email);
          location.reload();
        }

        return await response.json();
    } catch (error) {
        alert('Failed to login');
        return { error };
    }
}


async function applyAffiliateLink(allowedBrand, selectedTeam){
  // if (selectedTeam === "------Your Teams-----" || selectedTeam === "-----Default Charities-----") {
  //   alert("PICK A TEAM");
  //   return
  // }

  const programId = allowedBrand.campaignID;
  const url = LOCAL_ENV ? `http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/applyTrackingLink?programId=${programId}&teamName=${SELECTED_TEAM}` 
      : `https://applytrackinglink-6n7me4jtka-uc.a.run.app?programId=${programId}&teamName=${SELECTED_TEAM}`;

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


// applyGoogleSearchDiscounts();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyImpactLink);
}

async function fetchAllowedDomains() {
  let allowedDomains = JSON.parse(localStorage.getItem('sc-allowed-domains')) || null;
  const cachedTimestamp = localStorage.getItem('sc-cache-timestamp');
  const currentTime = new Date().getTime();

  if (allowedDomains && Object.keys(allowedDomains).length !== 0 && cachedTimestamp) {
    // Check if cache is still valid (within 24 hours)
    const cacheExpiryTime = parseInt(cachedTimestamp) + 24 * 60 * 60 * 1000;
    if (currentTime < cacheExpiryTime) {
      return allowedDomains;
    }
  }

  const url = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/allowedDomains" : "https://alloweddomains-6n7me4jtka-uc.a.run.app";
  allowedDomains = await fetchDataFromServer(url) || [];
  
  // Update cache with new data and timestamp
  localStorage.setItem('sc-allowed-domains', JSON.stringify(allowedDomains));
  localStorage.setItem('sc-cache-timestamp', currentTime.toString());

  return allowedDomains;
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


// function getAllowedMainDomains(campaigns){
//   return campaigns.map((campaign)=> {
//     const hostname = new URL(campaign?.advertiserURL)?.hostname;
//     const mainDomain = hostname.split('.').slice(-2).join('.');
//     return mainDomain;
//   })
// }

// async function main(){
  function applyGoogleSearchDiscounts(campaigns) {
    const searchResults = document.querySelectorAll('div.g');

    searchResults.forEach(result => {
      const href = result.querySelector('a[href^="http"]')?.href;
      const url = href || extractUrlFromCite(result);

      if (!url) {
        console.log("url-->", url);
        console.log("asdasd-->", result.querySelector('a[href^="http"]'));
        console.log("123123-->", extractUrlFromCite(result));
        return
      }

      const domain = new URL(url).hostname;

      campaigns.map((campaign) => {
        const allowedDomain = new URL(campaign.advertiserURL).hostname;
        const percentage = (campaign.discountPercentage * COMMISSION_RATE) + "%";

        if (!domain.includes(allowedDomain)) {
          return
        }

        if (domain.includes(allowedDomain)) {
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
          textDiv.textContent = `Give ${percentage} to your cause 💜`
          textDiv.href = campaign.trackingLink;
          textDiv.target = "_blank";

          mainDiv.appendChild(logoDiv);
          mainDiv.appendChild(textDiv);

          result.insertBefore(mainDiv, result.firstChild);
          return
        }
      })
    });
  }



///////////////////////////// NEW DESIGN //////////////////////////////////
function createIsolatedIframe(width, height) {
  // Create a new iframe element
  const iframe = document.createElement('iframe');

  // Set attributes for the iframe
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
  iframe.style.zIndex = 10000;
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

  // // Append the iframe to the document body
  // document.body.appendChild(iframe);

  // Trigger the animation after appending
  setTimeout(() => {
    iframe.style.top = '30%'; // Move down to the final position

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

  // Add the onClick event
  img.onclick = function() {
      isolatedIframe.style.visibility = 'visible';
  };

  // Return the img
  return img;
}


async function createActivatePageContainer(allowedBrand, closedDiv){

  const isolatedIframe = createIsolatedIframe('400px', '100px');

  isolatedIframe.onload = async function() {
    const leftDiv = createLeftDiv();
    const rightDiv = createRightDiv(isolatedIframe, allowedBrand, undefined, closedDiv);

    const iframeDocument = isolatedIframe.contentDocument || isolatedIframe.contentWindow.document;
    iframeDocument.body.innerHTML = '';
    iframeDocument.body.style.display = 'flex';
    iframeDocument.body.style.margin = '0px';

    iframeDocument.body.appendChild(leftDiv);
    iframeDocument.body.appendChild(rightDiv);
  };
  document.body.appendChild(isolatedIframe);
} 

function createLeftDiv() {
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
    image1.src = "https://i.imgur.com/Oj6PnUe.png";
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
    image2.src = "https://i.imgur.com/BntBs75.png";
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

    // Append the images wrapper and the third image to the left div
    div.appendChild(imagesWrapper);
    div.appendChild(image3);

    return div;
}

function createRightDiv(isolatedIframe, allowedBrand, couponInfo, closedDiv) {
    const discountAmount = couponInfo ? couponInfo?.amount : (allowedBrand.discountPercentage * COMMISSION_RATE)+"%";

    closedDiv.onclick = function () {
      isolatedIframe.style.display = '';
      closedDiv.style.display = 'none';
      localStorage.setItem('sc-minimize', false);
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
      window.localStorage.setItem('sc-minimize', true);
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

            if (allowedBrand) {
              await applyAffiliateLink(allowedBrand);
              localStorage.setItem('sc-minimize', false);
              localStorage.setItem('sc-activated', true);
            } 

            if (couponInfo) {
              await handleApplyCouponCode(couponInfo?.couponCode, isolatedIframe);
              localStorage.setItem('sc-minimize', false);
              localStorage.setItem('sc-activated', true);
            }
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


async function createAppliedLinkPageContainer(allowedBrand, closedDiv){
  const isolatedIframe = createIsolatedIframe('400px', '280px');
  isolatedIframe.onload = async function() {
    const navbar = createNavbar(isolatedIframe, closedDiv);
    const middleSection = createMiddleSection(allowedBrand);

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
}

function createNavbar(isolatedIframe, closedDiv) {
    closedDiv.onclick = function () {
      isolatedIframe.style.display = '';
      closedDiv.style.display = 'none';
      localStorage.setItem('sc-minimize', false);
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
      window.localStorage.setItem('sc-minimize', true);
      closedDiv.style.display = '';
    };
    div.appendChild(closeButton);


    div.appendChild(img1);
    div.appendChild(img2);

    return div;
}

function createMiddleSection(allowedBrand) {
    var div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";

    var img = document.createElement("img");
    img.src = "https://i.imgur.com/WGbvcpd.png";
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
    p.textContent = `Your purchases will now give up to ${allowedBrand.discountPercentage * COMMISSION_RATE}% to \n` + SELECTED_TEAM;
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


///////////////////// COUPON CODE ////////////////////////////
async function createApplyCouponCodeContainer(couponInfo, closedDiv){
  const isolatedIframe = createIsolatedIframe('400px', '100px');
  isolatedIframe.onload = async function() {
    const leftDiv = createLeftDiv();
    const rightDiv = createRightDiv(isolatedIframe, undefined, couponInfo, closedDiv);

    const iframeDocument = isolatedIframe.contentDocument || isolatedIframe.contentWindow.document;
    iframeDocument.body.innerHTML = '';
    iframeDocument.body.style.display = 'flex';
    iframeDocument.body.style.margin = '0px';

    iframeDocument.body.appendChild(leftDiv);
    iframeDocument.body.appendChild(rightDiv);
  };
  document.body.appendChild(isolatedIframe);
}