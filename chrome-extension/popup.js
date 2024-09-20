const LOCAL_ENV = true;

const UrlApplyRakutenDeepLink = LOCAL_ENV ? 'http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/applyRakutenDeepLink' : 'todo';

// DUBLICATE CODE
async function applyAffiliateLink(campaignID, userSettings){
  const { selectedCharityObject, email } = userSettings;

  if (!selectedCharityObject?.organizationName) {
    throw new Error('No Charity Selected');
  }

  // NOTE: CampaignID is same as ProgramId;
  const url = LOCAL_ENV ? `http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/applyTrackingLink?programId=${campaignID}&teamName=${selectedCharityObject.organizationName}&email=${email}` 
      : `https://applytrackinglink-6n7me4jtka-uc.a.run.app?programId=${campaignID}&teamName=${selectedCharityObject.organizationName}&email=${email}`;

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

async function applyRakutenDeepLink(campaign, userSettings) {

  const trackingLink = await postProcess(UrlApplyRakutenDeepLink, {
    advertiserUrl: campaign.advertiserURL,
    advertiserId: Number(campaign.campaignID),
    teamName: userSettings.selectedCharityObject.organizationName
  });

  return trackingLink;
}

async function createMerchantContainer(campaign, userSettings) {
  const title = campaign.campaignName;
  const subTitle = `${campaign.defaultPayoutRate}% on Sales`;
  const imageSrc = campaign.campaignLogoURI;
  const campaignID = campaign.campaignID;

  const newDiv = document.createElement('a');
  newDiv.target = "_blank";
  newDiv.classList.add('merchant');

  // Create elements programmatically to avoid XSS risks
  const headerDiv = document.createElement('div');
  headerDiv.classList.add('merchant-header');
  headerDiv.textContent = title;

  const discountDiv = document.createElement('div');
  discountDiv.classList.add('merchant-discount');
  discountDiv.textContent = subTitle;

  const imgWrapperDiv = document.createElement('div');
  imgWrapperDiv.classList.add('merchant-img-wrapper');

  const imgElement = document.createElement('img');
  imgElement.classList.add('merchant-img');
  imgElement.src = imageSrc;
  imgElement.alt = title;
  imgElement.onerror = function() {
    imgElement.style.display = 'none'; // Hide the image if it fails to load
  };

  imgWrapperDiv.appendChild(imgElement);
  newDiv.appendChild(headerDiv);
  newDiv.appendChild(discountDiv);
  newDiv.appendChild(imgWrapperDiv);
  
  newDiv.onclick = async function () {
    let redirectionLink;

    if (campaign.provider === "Impact") {
      redirectionLink = await applyAffiliateLink(campaignID, userSettings)
      chrome.tabs.create({ url: "http://" + redirectionLink });
    } 

    if (campaign.provider === "Rakuten"){
      redirectionLink = await applyRakutenDeepLink(campaign, userSettings)
      chrome.tabs.create({ url: redirectionLink });
    }

  }

  return newDiv;
}


function createHeaderContent(name, charity) {
    return `
        <div style="margin: 0;" class="merchant-img-wrapper">
            <img class="merchant-img" src=${charity.logo}></img>
        </div>
        <h4 style="margin-bottom: 5px;margin-top: 5px;">${name}, you are supporting ${charity.organizationName}</h4>
        <div class="sub-text">Checkout our featured merchants to start raising</div>
    `;
}

function createHeaderContentLogin() {
  const url = LOCAL_ENV ? `https://localhost:3000/onboard?extensionId=${chrome.runtime.id}` : `https://sc-affiliate.vercel.app/onboard?extensionId=${chrome.runtime.id}`

    return `
        <div style="margin: 0;" class="merchant-img-wrapper">
            <img class="merchant-img" src="https://i.imgur.com/Oj6PnUe.png"></img>
        </div>
        <h3><a target="_blank" href=${url}>Get started</a> and start raising</h3>
        <div class="sub-text">with our featured merchants</div>
    `;
}

// DUBLICATE CODE
async function processGet(url) {
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

async function fetchCampaigns() {
  const url = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getSyncedCampaigns" : "https://us-central1-sponsorcircle-3f648.cloudfunctions.net/getSyncedCampaigns";
  return await processGet(url);
}

async function postProcess(url, payload) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the JSON response from the server
  } catch (error) {
    console.error('POST request failed:', error);
    return null; // Return null if the request fails
  }
}

function showPinSuggestion() {
  document.getElementById('pinSuggestion').style.display = 'block';
}

function getDataFromStorage() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("userSettings", function(data) {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve(data.userSettings);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', async function() {
  const merchantsContainer = document.querySelector('.merchants-container');
  const welcomeContainer = document.getElementById('welcomeDiv');
  const userSettings = await getDataFromStorage();

  if (welcomeContainer) {
    chrome.storage.local.get('userSettings', function() {

      if (userSettings && userSettings.selectedCharityObject && userSettings.firstName) {
        const headerContent = createHeaderContent(userSettings.firstName, userSettings.selectedCharityObject)
        welcomeContainer.innerHTML = headerContent;
      } else {
        if (!userSettings || !userSettings.firstName || !userSettings.selectedCharityObject.logo) {
          const headerContent = createHeaderContentLogin();
          welcomeContainer.innerHTML = headerContent;
        } else {
          const { firstName, selectedCharityObject} = userSettings;
          const headerContent = createHeaderContent(firstName, selectedCharityObject)
          welcomeContainer.innerHTML = headerContent;
        } 
      }
    });
  }

  const closePinningSuggestion = document.getElementById('closePinSuggesstion');

  if (closePinningSuggestion) {
    closePinningSuggestion.addEventListener('click', function() {
    
      const pinSuggestion = document.getElementById('pinSuggestion');
      pinSuggestion.style.display = 'none';
      chrome.storage.local.set({ isFirstInstall: false }, function() {
        if (chrome.runtime.lastError) {
          console.error('Error setting isFirstInstall to false:', chrome.runtime.lastError.message);
        } else {
          console.log('isFirstInstall set to false successfully.');
        }
      });
    });
  }

  if (merchantsContainer) {
    const campaigns = await fetchCampaigns();    

    try {
      for (const campaign of campaigns) {
        const newMerchantDiv = await createMerchantContainer(campaign, userSettings);
        merchantsContainer.appendChild(newMerchantDiv);
      }

    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  } else {
    console.error('Merchants container not found');
  }

  // Show pin suggestion on first installation
  chrome.storage.local.get('isFirstInstall', function(data) {
    if (data.isFirstInstall) {
      showPinSuggestion();
    }
  });
});
