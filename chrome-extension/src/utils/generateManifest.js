// Import the createManifest function
const { createManifest } = require('./buildHelper');

// URL to fetch host permissions (replace with the actual URL)
const apiUrl = process.env.NODE_ENV === "development" ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getSyncedCampaigns" : 'https://us-central1-sponsorcircle-3f648.cloudfunctions.net/getSyncedCampaigns';

// Generate the manifest before Webpack runs
createManifest(apiUrl)
  .then(() => {
    console.log('Manifest generated successfully!');
    process.exit(0); // Exit the script successfully
  })
  .catch((error) => {
    console.error('Failed to generate manifest:', error);
    process.exit(1); // Exit the script with an error code
  });
