document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const blockForm = document.getElementById('blockForm');
    const domainInput = document.getElementById('domain');
    const durationInput = document.getElementById('duration');
    const timeUnitSelect = document.getElementById('timeUnit');
    const blockedList = document.getElementById('blockedList');
    const noSitesMessage = document.getElementById('noSitesMessage');
    
    // Initialize: load and display blocked sites
    loadBlockedSites();
    
    // Event listener for form submission
    blockForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validate input
      const domain = sanitizeDomain(domainInput.value);
      if (!domain) {
        shakeDomainInput();
        return;
      }
      
      const duration = parseInt(durationInput.value);
      if (isNaN(duration) || duration <= 0) {
        shakeDurationInput();
        return;
      }
      
      const timeUnit = timeUnitSelect.value;
      
      // Calculate expiry time (in milliseconds)
      const minutesToAdd = timeUnit === 'hours' ? duration * 60 : duration;
      const expiresAt = Date.now() + (minutesToAdd * 60 * 1000);
      
      // Save the blocked site
      addBlockedSite(domain, expiresAt);
      
      // Reset form
      domainInput.value = '';
      durationInput.value = '30';
      timeUnitSelect.value = 'minutes';
      
      // Force refresh the list
      loadBlockedSites();
    });
    
    function sanitizeDomain(domain) {
      // Remove protocol, path, and whitespace
      let sanitized = domain.trim().toLowerCase();
      sanitized = sanitized.replace(/^(https?:\/\/)?(www\.)?/i, '');
      sanitized = sanitized.split('/')[0]; // Remove any path
      
      // Basic validation
      if (sanitized && sanitized.includes('.')) {
        return sanitized;
      }
      return '';
    }
    
    function loadBlockedSites() {
      chrome.storage.local.get('blockedSites', (data) => {
        const blockedSites = data.blockedSites || [];
        
        // Clear the current list
        while (blockedList.firstChild) {
          if (blockedList.firstChild === noSitesMessage) {
            break;
          }
          blockedList.removeChild(blockedList.firstChild);
        }
        
        // Filter out expired sites
        const now = Date.now();
        const activeSites = blockedSites.filter(site => site.expiresAt > now);
        
        // Show "no sites" message if no active blocks
        noSitesMessage.style.display = activeSites.length === 0 ? 'block' : 'none';
        
        // Add each site to the UI
        activeSites.forEach((site) => {
          const siteElement = createSiteElement(site);
          blockedList.insertBefore(siteElement, noSitesMessage);
        });
        
        // If we filtered any expired sites, update storage
        if (blockedSites.length !== activeSites.length) {
          chrome.storage.local.set({ blockedSites: activeSites });
        }
      });
    }
    
    function createSiteElement(site) {
      const siteDiv = document.createElement('div');
      siteDiv.className = 'flex justify-between items-center py-2 px-3 border-b border-gray-100 fade-in';
      
      const domainSpan = document.createElement('span');
      domainSpan.className = 'font-medium text-gray-800';
      domainSpan.textContent = site.domain;
      
      const timeDiv = document.createElement('div');
      timeDiv.className = 'text-xs text-gray-500';
      
      const expiryTime = new Date(site.expiresAt);
      timeDiv.textContent = `Unblocks at: ${formatTime(expiryTime)}`;
      
      siteDiv.appendChild(domainSpan);
      siteDiv.appendChild(timeDiv);
      
      return siteDiv;
    }
    
    function formatTime(date) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    function addBlockedSite(domain, expiresAt) {
      chrome.storage.local.get('blockedSites', (data) => {
        const blockedSites = data.blockedSites || [];
        
        // Check if site is already blocked
        const existingIndex = blockedSites.findIndex(site => site.domain === domain);
        
        if (existingIndex !== -1) {
          // Update existing entry
          blockedSites[existingIndex].expiresAt = expiresAt;
        } else {
          // Add new entry
          blockedSites.push({ domain, expiresAt });
        }
        
        // Save updated list
        chrome.storage.local.set({ blockedSites });
        
        // Notify background script to update its state
        chrome.runtime.sendMessage({ action: 'updateBlockedSites' });
      });
    }
    
    function shakeDomainInput() {
      domainInput.classList.add('shake');
      domainInput.style.borderColor = 'red';
      
      setTimeout(() => {
        domainInput.classList.remove('shake');
        domainInput.style.borderColor = '';
      }, 500);
    }
    
    function shakeDurationInput() {
      durationInput.classList.add('shake');
      durationInput.style.borderColor = 'red';
      
      setTimeout(() => {
        durationInput.classList.remove('shake');
        durationInput.style.borderColor = '';
      }, 500);
    }
    
    // Setup auto-refresh of blocked sites list
    setInterval(loadBlockedSites, 30000); // Refresh every 30 seconds
  });