const LOCAL_ENV = true;
const SELECTED_TEAM = '(A.C.C.E.S.) ACCESSIBLE COMMUNITY COUNSELLING AND EMPLOYMENT SERVICES'

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

// Function to create and style the button
function createActivateButton(allowedBrand, allowedTeamsDropdown) {
  const button = document.createElement('button');
  button.textContent = 'Activate';
  button.style.display = 'block';
  button.style.width = '100%';
  button.style.padding = '10px';
  button.style.marginTop = '10px';
  button.style.border = '1px solid #ccc';
  button.style.backgroundColor = '#fff';
  button.style.color = '#333';
  button.style.fontFamily = 'Arial, sans-serif';
  button.style.fontSize = '16px';
  button.style.cursor = 'pointer';

  button.addEventListener('click', async function() {
    const selectedValue = allowedTeamsDropdown.value;
    await applyAffiliateLink(allowedBrand, selectedValue);
  });

  return button;
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

function getAllowedBrandInfo(allowedDomainsWithIds) {
  const currentWebsiteUrl = window.location.hostname;

  for (const [url, id] of Object.entries(allowedDomainsWithIds)) {

    const urlHostname = new URL(url);
    if (currentWebsiteUrl.includes(urlHostname.hostname)) {
      return { url: urlHostname, id };
    }
  }

  return null;
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

/////////////////////////////////////////////////////////////
async function initialize() {

  // If user closed the extension
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('sponsor-circle-extension') === 'false') {
    return
  }

  // If Couponsed Website show coupon view
  const couponInfo = isCouponedWebsite();
  if (couponInfo) {
    console.log("THIS IS A COUPON BRAND");
    await createApplyCouponCodeContainer(couponInfo);
  } else {
    const allowedDomainsWithIds = await fetchAllowedDomains();
    const codeAlreadyAppliedToURL = window.location.href.includes("irclickid") || window.location.href.includes("clickid");;
    const allowedBrand = getAllowedBrandInfo(allowedDomainsWithIds);

    const isGoogleSearch = window.location.href.includes('https://www.google.com/search');

    if (isGoogleSearch) {
      await applyGoogleSearchDiscounts(allowedDomainsWithIds);
    }

    if (allowedBrand && !codeAlreadyAppliedToURL) {
      await createActivatePageContainer(allowedBrand);
    }

    if (allowedBrand && codeAlreadyAppliedToURL) {
      await createAppliedLinkPageContainer(allowedBrand);
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

  const programId = allowedBrand.id;
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

  if (allowedDomains && Object.keys(allowedDomains).length !== 0) {
    return allowedDomains
  }

  const url = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/allowedDomains" : "https://alloweddomains-6n7me4jtka-uc.a.run.app";
  allowedDomains = await fetchDataFromServer(url) || [];

  localStorage.setItem('sc-allowed-domains', JSON.stringify(allowedDomains));

  return allowedDomains;
}



// async function main(){
  function applyGoogleSearchDiscounts(allowedDomainsWithIds) {

    console.log("allowedDomainsWithIds ->", allowedDomainsWithIds);

    const percentage = "TODO%";
    const searchResults = document.querySelectorAll('div.g');

    searchResults.forEach(result => {
      const url = result.querySelector('a[href^="http"]').href;
      const domain = new URL(url).hostname;

      for (const [url, id] of Object.entries(allowedDomainsWithIds)) {
        const allowedDomain = new URL(url).hostname;

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

          const textDiv = document.createElement('div');
          textDiv.style.whiteSpace = 'nowrap';
          textDiv.textContent = `Give ${percentage} to your cause 💜`

          mainDiv.appendChild(logoDiv);
          mainDiv.appendChild(textDiv);

          result.insertBefore(mainDiv, result.firstChild);
        }
      }
    });
  }

//   // Function to simulate fetching allowed domains with a delay
//   async function fetchAllowedDomains() {

//     let allowedDomains = JSON.parse(localStorage.getItem('sc-allowed-domains')) || null;

//     if (allowedDomains && Object.keys(allowedDomains).length !== 0) {
//       return allowedDomains
//     }

//     console.log("CALLING ALLOWED DOMAINS");
//     const url = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/allowedDomains" : "https://alloweddomains-6n7me4jtka-uc.a.run.app";
//     allowedDomains = await fetchDataFromServer(url) || [];

//     localStorage.setItem('sc-allowed-domains', JSON.stringify(allowedDomains));

//     return allowedDomains;
//   }


//   const allowedDomains = await fetchAllowedDomains();
//   applyGoogleSearchDiscounts(allowedDomains);
// }

// main();








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
  }, 0);

  // Return the created iframe
  return iframe;
}


async function createActivatePageContainer(allowedBrand){
  const isolatedIframe = createIsolatedIframe('400px', '100px');
  isolatedIframe.onload = async function() {

    const leftDiv = createLeftDiv();
    const rightDiv = createRightDiv(isolatedIframe, allowedBrand);

    const iframeDocument = isolatedIframe.contentDocument || isolatedIframe.contentWindow.document;
    iframeDocument.body.innerHTML = '';
    iframeDocument.body.style.display = 'flex';
    iframeDocument.body.style.margin = '0px';

    iframeDocument.body.appendChild(leftDiv);
    iframeDocument.body.appendChild(rightDiv);


    /////////  ROUGH ///////////
    // const loginForm = generateLoginForm();
    // const greetingDiv = greetUser();
    // const closeButton = createCloseButton(isolatedIframe);

    // const userEmail = localStorage.getItem('sponsorcircle-useremail');
    // if (userEmail) {
    //     const allowedTeams = await fetchAllowedGroups(userEmail);
    //     const allowedCharaties = await fetchDefaultCharaties();

    //     // const teamsCobined = ["------Your Teams-----" ,...allowedTeams, "-----Default Charities-----", ...allowedCharaties];

    //     const { allowedTeamsDropdown, selectElement } = createDropdownWithOptions(allowedCharaties, "Pick A Team:");

    //     const activateButton = createActivateButton(allowedBrand, selectElement);
    //     const logoutbutton = createLogoutButton();

    //     iframeDocument.body.appendChild(closeButton);
    //     iframeDocument.body.appendChild(greetingDiv);
    //     iframeDocument.body.appendChild(allowedTeamsDropdown);
    //     // iframeDocument.body.appendChild(allowedCharatiesDropdown);
    //     iframeDocument.body.appendChild(activateButton);
    //     iframeDocument.body.appendChild(logoutbutton);
    // } else {
    //   iframeDocument.body.appendChild(closeButton);
    //   iframeDocument.body.appendChild(loginForm);
    // }
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

function createRightDiv(isolatedIframe, allowedBrand, couponInfo) {
    const discountAmount = couponInfo ? couponInfo.amount : "TODO";

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
      let url = new URL(window.location.href);
      url.searchParams.set('sponsor-circle-extension', 'false');
      isolatedIframe.style.display = 'none';
      window.history.replaceState(null, '', url.toString());
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
            if (allowedBrand) {
              await applyAffiliateLink(allowedBrand);
            } 

            if (couponInfo) {
              await handleApplyCouponCode(couponInfo?.couponCode, isolatedIframe);
            }
        } catch (error) {
            console.error("Error activating to give:", error);
        }
    };

    div.appendChild(button);

    return div;
}


////////////////////////// ACTIVATED LINK ///////////////////////////
async function createAppliedLinkPageContainer(allowedBrand){
  const isolatedIframe = createIsolatedIframe('400px', '280px');
  isolatedIframe.onload = async function() {
    const navbar = createNavbar(isolatedIframe);
    const middleSection = createMiddleSection(allowedBrand);

    const iframeDocument = isolatedIframe.contentDocument || isolatedIframe.contentWindow.document;
    iframeDocument.body.innerHTML = '';
    iframeDocument.body.style.display = 'flex';
    iframeDocument.body.style.flexDirection = 'column';
    iframeDocument.body.style.margin = '0px';
    iframeDocument.body.style.fontFamily = "Montserrat";

    iframeDocument.body.appendChild(navbar);
    iframeDocument.body.appendChild(middleSection);


    /////////  ROUGH ///////////
    // const loginForm = generateLoginForm();
    // const greetingDiv = greetUser();
    // const closeButton = createCloseButton(isolatedIframe);

    // const userEmail = localStorage.getItem('sponsorcircle-useremail');
    // if (userEmail) {
    //     const allowedTeams = await fetchAllowedGroups(userEmail);
    //     const allowedCharaties = await fetchDefaultCharaties();

    //     // const teamsCobined = ["------Your Teams-----" ,...allowedTeams, "-----Default Charities-----", ...allowedCharaties];

    //     const { allowedTeamsDropdown, selectElement } = createDropdownWithOptions(allowedCharaties, "Pick A Team:");

    //     const activateButton = createActivateButton(allowedBrand, selectElement);
    //     const logoutbutton = createLogoutButton();

    //     iframeDocument.body.appendChild(closeButton);
    //     iframeDocument.body.appendChild(greetingDiv);
    //     iframeDocument.body.appendChild(allowedTeamsDropdown);
    //     // iframeDocument.body.appendChild(allowedCharatiesDropdown);
    //     iframeDocument.body.appendChild(activateButton);
    //     iframeDocument.body.appendChild(logoutbutton);
    // } else {
    //   iframeDocument.body.appendChild(closeButton);
    //   iframeDocument.body.appendChild(loginForm);
    // }
  };
  document.body.appendChild(isolatedIframe);
}

function createNavbar(isolatedIframe) {
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
    };
    div.appendChild(closeButton);


    div.appendChild(img1);
    div.appendChild(img2);

    return div;
}

function createMiddleSection() {
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
    p.textContent = "Your purchases will now give up to 0.07% to " + SELECTED_TEAM;
    p.style.textAlign = "center";
    p.style.margin = "0px";
    p.style.fontFamily = "Montserrat";
    p.style.fontSize = "14px";
    p.style.fontStyle = "normal";
    p.style.fontWeight = "400";
    p.style.lineHeight = "normal";

    div.appendChild(img);
    div.appendChild(h1);
    div.appendChild(p);

    return div;
}


///////////////////// COUPON CODE ////////////////////////////
async function createApplyCouponCodeContainer(couponInfo){
  const isolatedIframe = createIsolatedIframe('400px', '100px');
  isolatedIframe.onload = async function() {
    const leftDiv = createLeftDiv();
    const rightDiv = createRightDiv(isolatedIframe, undefined, couponInfo);

    const iframeDocument = isolatedIframe.contentDocument || isolatedIframe.contentWindow.document;
    iframeDocument.body.innerHTML = '';
    iframeDocument.body.style.display = 'flex';
    iframeDocument.body.style.margin = '0px';

    iframeDocument.body.appendChild(leftDiv);
    iframeDocument.body.appendChild(rightDiv);
  };
  document.body.appendChild(isolatedIframe);
}