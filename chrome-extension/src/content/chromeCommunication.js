

export function sendDataToContentScript(data) {
    chrome.storage.local.set(data, function() {
        console.log('User settings saved to local storage');
    });
}

export async function getUserSettingsFromGoogleSearch() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("userSettingsFromGoogleSearch", function(data) {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve(data.userSettingsFromGoogleSearch);
            }
        });
    });
}

export function getDataFromStorage() {
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

export async function getUserSettingsFromPopup() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("userSettingsFromPopup", function(data) {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve(data.userSettingsFromPopup);
            }
        });
    });
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sendData") {
    console.log("Data received in content script:", message.data);
  }
});