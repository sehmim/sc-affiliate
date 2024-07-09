const LOCAL_ENV = false;

console.log('Background script loaded.');

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    chrome.windows.create({
      url: 'popup.html',
      type: 'popup',
      width: 540,
      height: 510,
    })

    const onboardingUrl = LOCAL_ENV ? "https://localhost:3000/onboard" : "https://sc-affiliate.vercel.app/onboard"; 
    chrome.tabs.create({ url: onboardingUrl });

    chrome.storage.local.set({ isFirstInstall: true });
  }
});

chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {
    if (message.action === "sendData") {
        chrome.storage.local.set({ userSettings: message.data });
        sendResponse({ userSettings: message.data });
    }
});

function isGoogle(url) {
    // Use a regular expression to match "http(s)://www.google." followed by any characters
    const pattern = /^https?:\/\/www\.google\.\w+/i;
    return pattern.test(url);
}


// background.js
function isCookieExpired(url, cookieName, callback) {
    // Ensure the URL includes a protocol
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }

    if (isGoogle(url)) {
        return
    }

    console.log(`Checking cookie: ${cookieName} for URL: ${url}`); // Debug log

    chrome.cookies.get({ url: url, name: cookieName }, function(cookie) {
        if (chrome.runtime.lastError) {
            console.error('Error retrieving cookie:', JSON.stringify(chrome.runtime.lastError));
            callback(true); // Treat as expired if there was an error
            return;
        }

        if (cookie) {
            if (cookie.expirationDate) {
                // Compare the expiration date with the current date
                var expirationDate = new Date(cookie.expirationDate * 1000); // expirationDate is in seconds since the epoch
                callback(expirationDate < new Date());
            } else {
                // No expiration date means it's a session cookie
                callback(false);
            }
        } else {
            // Cookie not found
            callback(true);
        }
    });
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'checkCookie' && request.url && request.cookieName) {
        console.log(`Received request to check cookie: ${request.cookieName} for URL: ${request.url}`); // Debug log
        isCookieExpired(request.url, request.cookieName, function(isExpired) {
            sendResponse({ expired: isExpired });
        });
        return true; // Indicates that the response will be sent asynchronously
    } else {
        console.error('Invalid request: Missing URL or cookie name');
        sendResponse({ error: 'Invalid request: Missing URL or cookie name' });
        return false;
    }
});
