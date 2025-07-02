// Extract domain from current page
function getCurrentDomain() {
    return window.location.hostname.replace(/^www\./, '');
  }
  
  // Check if the current page should be blocked
  function checkIfBlocked() {
    const currentDomain = getCurrentDomain();
    
    chrome.storage.local.get('blockedSites', (data) => {
      const blockedSites = data.blockedSites || [];
      const now = Date.now();
      
      // Find if this site is blocked
      const blockedSite = blockedSites.find(site => {
        return site.domain === currentDomain && site.expiresAt > now;
      });
      
      if (blockedSite) {
        // Block the page
        blockPage(blockedSite);
      }
    });
  }
  
  // Block the page and show motivation message
  function blockPage(siteInfo) {
    // Create block page HTML
    const unblockTime = new Date(siteInfo.expiresAt).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
    
    // Select a random motivation message
    const motivationMessages = [
      "Stay focused! Your future self will thank you.",
      "Small distractions lead to big setbacks. Keep going!",
      "Productivity is a habit. You're building it right now.",
      "Every minute of focus is a step toward your goals.",
      "You've got this! Remember why you started."
    ];
    
    const randomMessage = motivationMessages[Math.floor(Math.random() * motivationMessages.length)];
    
    // Create block page content
    const blockPageHTML = `
      <style>
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f9fafb;
          color: #1f2937;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
          text-align: center;
        }
        .container {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          max-width: 500px;
          width: 100%;
        }
        h1 {
          color: #3b82f6;
          font-size: 1.75rem;
          margin-bottom: 1rem;
        }
        .site-name {
          font-weight: bold;
          color: #4b5563;
        }
        .message {
          font-size: 1.25rem;
          margin: 1.5rem 0;
          color: #111827;
        }
        .time-info {
          background-color: #eef2ff;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1.5rem;
          color: #4f46e5;
        }
        .Offdem-logo {
          opacity: 0.7;
          margin-bottom: 1rem;
          font-size: 1.25rem;
          font-weight: bold;
          color: #3b82f6;
        }
      </style>
      <div class="container">
        <div class="Offdem-logo">Offdem</div>
        <h1>This site is currently blocked</h1>
        <p>You've chosen to block <span class="site-name">${siteInfo.domain}</span> to improve your focus.</p>
        <div class="message">"${randomMessage}"</div>
        <div class="time-info">
          This site will be available again at ${unblockTime}
        </div>
      </div>
    `;
    
    // Replace page content
    document.body.innerHTML = blockPageHTML;
    document.title = "Site Blocked - Offdem";
    
    // Stop any further loading
    window.stop();
  }
  
  // Run the check when page loads
  checkIfBlocked();