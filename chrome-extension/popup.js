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
  const url = "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getCampaigns";
  const campaigns = await fetchDataFromServer(url);

  return campaigns;
}

const merchantLinks = [
  {
    title: "Mark's",
    subtitle: "up to 7.6%",
    imageSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLbHCo5fu86eEqgle59e-ht92ScGGd5vjuX-sJXU1QtQ&s",
    href: "https://www.marks.com/"
  },
  {
    title: "Moosejaw",
    subtitle: "up to 10%",
    imageSrc: "https://www.bicycleretailer.com/sites/default/files/styles/article_primary_image/public/images/article/moosejaw.gif?itok=yOsO6NbJ",
    href: "https://www.moosejaw.com"
  },
  {
    title: "Curiosity Box",
    subtitle: "up to 5%",
    imageSrc: "https://example.com/curiositybox.jpg",
    href: "https://www.curiositybox.com/"
  },
  {
    title: "Print Trendy",
    subtitle: "up to 12%",
    imageSrc: "https://example.com/printrendy.jpg",
    href: "https://printrendy.com/"
  },
  {
    title: "Lumiere Hairs",
    subtitle: "up to 8%",
    imageSrc: "https://example.com/lumierehairs.jpg",
    href: "https://lumierehairs.com/"
  },
  {
    title: "Springfree Trampoline",
    subtitle: "up to 7%",
    imageSrc: "https://example.com/springfreetrampoline.jpg",
    href: "https://www.springfreetrampoline.com/"
  },
  {
    title: "Wish",
    subtitle: "up to 15%",
    imageSrc: "https://example.com/wish.jpg",
    href: "http://wish.com"
  },
  {
    title: "Decathlon Canada",
    subtitle: "up to 5%",
    imageSrc: "https://example.com/decathlon.jpg",
    href: "https://www.decathlon.ca/en"
  },
  {
    title: "Easyship",
    subtitle: "up to 10%",
    imageSrc: "https://example.com/easyship.jpg",
    href: "https://www.easyship.com/"
  },
  {
    title: "Fanatics",
    subtitle: "up to 8%",
    imageSrc: "https://example.com/fanatics.jpg",
    href: "https://www.fanatics.com/"
  },
  {
    title: "Points",
    subtitle: "up to 6%",
    imageSrc: "https://example.com/points.jpg",
    href: "https://www.points.com/"
  },
  {
    title: "Pro Hockey Life",
    subtitle: "up to 12%",
    imageSrc: "https://example.com/prohockeylife.jpg",
    href: "http://www.prohockeylife.com/"
  },
  {
    title: "Copa Airlines",
    subtitle: "up to 7%",
    imageSrc: "https://example.com/copaair.jpg",
    href: "https://www.copaair.com/en-us/connectmiles/about-connectmiles/"
  },
  {
    title: "Strainz",
    subtitle: "up to 10%",
    imageSrc: "https://example.com/strainz.jpg",
    href: "https://strainz.com/about-strainz/"
  },
  {
    title: "Pure Hemp Botanicals",
    subtitle: "up to 9%",
    imageSrc: "https://example.com/purehempbotanicals.jpg",
    href: "http://purehempbotanicals.com/"
  },
  {
    title: "Paris Rhone",
    subtitle: "up to 8%",
    imageSrc: "https://example.com/parisrhone.jpg",
    href: "https://parisrhone.com/"
  },
  {
    title: "LivWell Nutrition",
    subtitle: "up to 10%",
    imageSrc: "https://example.com/livwellnutrition.jpg",
    href: "http://livwellnutrition.com/"
  },
  {
    title: "Packed With Purpose",
    subtitle: "up to 7%",
    imageSrc: "https://example.com/packedwithpurpose.jpg",
    href: "http://packedwithpurpose.gifts/"
  },
  {
    title: "InVideo",
    subtitle: "up to 12%",
    imageSrc: "https://example.com/invideo.jpg",
    href: "http://invideo.io/"
  },
  {
    title: "Impact",
    subtitle: "up to 9%",
    imageSrc: "https://example.com/impact.jpg",
    href: "http://impact.com/"
  },
  {
    title: "Event Trix",
    subtitle: "up to 8%",
    imageSrc: "https://example.com/eventtrix.jpg",
    href: "http://eventtrix.com/"
  },
  {
    title: "Atlas VPN",
    subtitle: "up to 15%",
    imageSrc: "https://example.com/atlasvpn.jpg",
    href: "http://atlasvpn.com/"
  }
];

document.addEventListener('DOMContentLoaded', async function() {
  const merchantsContainer = document.querySelector('.merchants-container');

  if (merchantsContainer) {
    const campaigns = await fetchCampaigns();

    try {
      for (const campaign of campaigns) {
        console.log("campaigns ->", campaigns.advertiserName);
        const subTitle = `up to ${campaign.discountPercentage}%`;

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