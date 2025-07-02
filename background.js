// Cache for blocked sites
let blockedSites = [];

// Initialize the extension
function initializeExtension() {
  // Load blocked sites from storage
  loadBlockedSites();
  
  // Set up periodic check for expired sites
  setInterval(checkExpiredSites, 30000); // Check every 30 seconds
}

// Load blocked sites from storage
function loadBlockedSites() {
  chrome.storage.local.get('blockedSites', (data) => {
    if (data.blockedSites) {
      // Filter out expired sites
      const now = Date.now();
      blockedSites = data.blockedSites.filter(site => site.expiresAt > now);
      
      // Update storage if we've removed any expired sites
      if (blockedSites.length !== data.blockedSites.length) {
        chrome.storage.local.set({ blockedSites });
      }
    } else {
      blockedSites = [];
    }
  });
}

// Check for expired sites and remove them
function checkExpiredSites() {
  const now = Date.now();
  const activeSites = blockedSites.filter(site => site.expiresAt > now);
  
  // If any sites have expired, update the cache and storage
  if (activeSites.length !== blockedSites.length) {
    blockedSites = activeSites;
    chrome.storage.local.set({ blockedSites });
  }
}

// Check if a URL is blocked
function isBlocked(url) {
  // Extract domain from URL
  const domain = extractDomain(url);
  
  // Check if domain is in the blocked list and not expired
  const now = Date.now();
  return blockedSites.some(site => {
    return site.domain === domain && site.expiresAt > now;
  });
}

// Extract domain from URL
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch (e) {
    return '';
  }
}

// Listen for tab updates to check if URL should be blocked
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url) {
    // Check if the URL should be blocked
    if (isBlocked(tab.url)) {
      // Inject content script to block the page
      chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
      });
    }
  }
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateBlockedSites') {
    loadBlockedSites();
  }
  return true;
});

// Initialize extension when loaded
initializeExtension();