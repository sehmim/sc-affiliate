console.log('Background script loaded.');

// chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {
//     console.log(message, sender);
//     sendResponse(true);
// });

// async function makeApiCall() {
    
// }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sendData") {
    console.log("Data received from React app:", message.data);
    // Process the data or send it to a content script if needed
    sendResponse({ status: "success" });
  }
  return true;  // Indicate that you want to send a response asynchronously
});