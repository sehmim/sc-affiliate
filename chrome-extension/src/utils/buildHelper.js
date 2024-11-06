const path = require('path');
const fs = require('fs');
const { urlGetSyncedCampaigns } = require('./env');

function formatURL(input) {
  let url = input.toLowerCase().replace(/^https?:\/\//, '');

  url = "https://" + url;

  if (!url.includes("www.")) {
    url = url.replace("https://", "https://www.");
  }

  if (!url.endsWith("/")) {
    url += "/";
  }

  return url;
}


async function fetchHostPermissions(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const campaigns = await response.json();

    
    const domains = campaigns.map((campaign) => (formatURL(campaign.advertiserURL)))
    fs.writeFileSync(path.resolve(__dirname, 'allowedDomains.json'), JSON.stringify(domains, null, 2), 'utf-8');
    
    return domains;

  } catch (error) {
    console.error('Error fetching host permissions:', error);
    return [];
  }
}

async function createManifest() {

  try {
    const domains = await fetchHostPermissions(urlGetSyncedCampaigns);

    const manifest = {
      manifest_version: 3,
      name: "Shop for Good",
      version: "1.76",
      description: "Tracks brands that give you discounts. When You Shop. You Save. Charities and Causes Win.",
      permissions: ["cookies", "storage"],
      action: {
        default_popup: "./popup.html"
      },
      content_scripts: [
        {
          matches: ["http://*/*", "https://*/*"],
          js: ["content.js"],
          css: ["css/index.css"]
        }
      ],
      externally_connectable: {
        matches: ["*://localhost/*", "*://sc-affiliate.vercel.app/*"]
      },
      web_accessible_resources: [
        {
          resources: ["css/index.css"],
          matches: ["http://*/*", "https://*/*"]
        }
      ],
      background: {
        service_worker: "background.js"
      },
      icons: {
        "16": "icons/icon.png",
        "48": "icons/icon.png",
        "128": "icons/icon.png"
      },
      host_permissions: domains
    };

    fs.writeFileSync(path.resolve(__dirname, '../../manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
    console.log('Manifest created successfully in build directory');  
  } catch (error) {
    console.log('error:', console.log(error))
  }
}

module.exports = {
  fetchHostPermissions,
  createManifest
}