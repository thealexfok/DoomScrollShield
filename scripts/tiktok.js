chrome.storage.sync.get(['blockTikTok'], result => {
    if (!result.blockTikTok) return;
  
    chrome.storage.sync.get(['blockCountTikTok'], res => {
      const current = res['blockCountTikTok'] || 0;
      chrome.storage.sync.set({ 'blockCountTikTok': current + 1 });
    });
  
    document.documentElement.innerHTML = `
      <style>
        body {
          background: #111;
          color: white;
          font-family: sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
          margin: 0;
        }
        .block-message {
          max-width: 400px;
          padding: 20px;
          background: #222;
          border: 1px solid #444;
          border-radius: 12px;
        }
      </style>
      <div class="block-message">
        <img src="${chrome.runtime.getURL('assets/logo.png')}" alt="DoomScroll Shield Logo" style="width: 100px; height: 100px; border-radius: 50%;" />
        <h1>🚫 TikTok Blocked</h1>
        <p>DoomScroll Shield blocked TikTok to protect your time. Change this in the extension settings if needed.</p>
      </div>
    `;
  });
  