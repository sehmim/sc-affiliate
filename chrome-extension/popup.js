const LOCAL_ENV = true;

function createMerchantContainer(title, subtitle, imageSrc, href) {
  const newDiv = document.createElement('a');
  newDiv.classList.add('merchant');

  newDiv.href = href;
  newDiv.target = "_blank";

  // Set innerHTML for the new div with the provided parameters
  newDiv.innerHTML = `
    <div class="merchant-header">${title}</div>
    <div class="merchant-discount">${subtitle}</div>
    <div class="merchant-img-wrapper">
        <img class="merchant-img" src="${imageSrc}">
    </div>
  `;

  return newDiv;
}

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
  const url = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getCampaigns" : "https://getcampaigns-6n7me4jtka-uc.a.run.app";
  const campaigns = await fetchDataFromServer(url);

  return campaigns;
}

document.addEventListener('DOMContentLoaded', async function() {
  const merchantsContainer = document.querySelector('.merchants-container');

  if (merchantsContainer) {
    const campaigns = await fetchCampaigns();

    try {
      for (const campaign of campaigns) {
        const subTitle = `up to ${campaign.discountPercentage * 0.50}%`;

        const newMerchantDiv = createMerchantContainer(campaign.advertiserName, subTitle, campaign.campaignLogoURI, campaign.advertiserURL);
        merchantsContainer.appendChild(newMerchantDiv);
      }

    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  } else {
    console.error('Merchants container not found');
  }
});