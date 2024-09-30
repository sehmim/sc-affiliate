const path = require('path');
const fs = require('fs');

async function fetchHostPermissions(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const campaigns = await response.json();

    
    const domains = campaigns.map((campaign) => (campaign.advertiserURL))
    fs.writeFileSync(path.resolve(__dirname, 'allowedDomains.json'), JSON.stringify(domains, null, 2), 'utf-8');
    
    return domains;

  } catch (error) {
    console.error('Error fetching host permissions:', error);
    return [];
  }
}

async function createManifest(apiUrl) {
  const hostPermissions = await fetchHostPermissions(apiUrl);

  const manifest = {
    manifest_version: 3,
    name: "Shop for Good",
    version: "1.61",
    description: "Tracks brands that give you discounts. When You Shop. You Save. Charities and Causes Win.",
    permissions: ["cookies", "storage"],
    action: {
      default_popup: "./popup/popup.html"
    },
    content_scripts: [
      {
        matches: [
          "http://*/*",
          "https://*/*"
        ],
        js: ["../../dist/content.js"],
        css: ["../../css/index.css"]
      }
    ],
    externally_connectable: {
      matches: [
        "*://localhost/*",
        "*://sc-affiliate.vercel.app/*"
      ]
    },
    web_accessible_resources: [
      {
        resources: ["../../css/index.css"],
        matches: [
          "http://*/*", 
          "https://*/*"
        ]
      }
    ],
    background: {
      service_worker: "../background/background.js"
    },
    icons: {
      "16": "../../icons/icon.png",
      "48": "../../icons/icon.png",
      "128": "../../icons/icon.png"
    },
    host_permissions: hostPermissions,
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self'",
      sandbox: "sandbox allow-scripts; script-src 'self' https://www.gstatic.com/ https://*.firebaseio.com https://www.googleapis.com"
    }
  };

  console.log('Manifest generated successfully!');
  // return manifest;
  // Write the manifest to a JSON file
  fs.writeFileSync(path.resolve(__dirname, '../../manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
}


module.exports = {
  fetchHostPermissions,
  createManifest
}