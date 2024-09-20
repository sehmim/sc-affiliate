const LOCAL_ENV = true;

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

async function createMerchantContainer(title, subtitle, imageSrc, campaignID, userSettings) {
  const newDiv = document.createElement('a');
  newDiv.target = "_blank";
  newDiv.classList.add('merchant');

  // Create elements programmatically to avoid XSS risks
  const headerDiv = document.createElement('div');
  headerDiv.classList.add('merchant-header');
  headerDiv.textContent = title;

  const discountDiv = document.createElement('div');
  discountDiv.classList.add('merchant-discount');
  discountDiv.textContent = subtitle;

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
    const responseData = await applyAffiliateLink(campaignID, userSettings)
    chrome.tabs.create({ url: "http://" + responseData });
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

async function fetchCampaigns() {
  const url = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getSyncedCampaigns" : "https://us-central1-sponsorcircle-3f648.cloudfunctions.net/getSyncedCampaigns";
  return await fetchDataFromServer(url);
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
        const subTitle = `${campaign.defaultPayoutRate}% on Sales`;

        const newMerchantDiv = await createMerchantContainer(campaign.campaignName, subTitle, campaign.campaignLogoURI, campaign.campaignID, userSettings);
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
