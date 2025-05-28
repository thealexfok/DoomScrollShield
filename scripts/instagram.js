function incrementCounter() {
    const key = 'blockCountInstagram';
    chrome.storage.sync.get([key], res => {
      const current = res[key] || 0;
      chrome.storage.sync.set({ [key]: current + 1 });
    });
  }
  
  function redirectIfInstagramReels() {
    const path = location.pathname;
    if (path.startsWith('/reels') || path.includes('/reel/')) {
      incrementCounter();
      location.href = 'https://www.instagram.com/';
    }
  }
  
  function hideInstagramReelsButton() {
    const reelsButton = document.querySelector('a[href="/reels/"]');
    if (reelsButton && reelsButton.style.display !== 'none') {
      reelsButton.style.display = 'none';
      incrementCounter();
    }
  }
  
  chrome.storage.sync.get(['blockInstagram'], result => {
    if (!result.blockInstagram) return;
  
    redirectIfInstagramReels();
    hideInstagramReelsButton();
  
    const instaPush = history.pushState;
    const instaReplace = history.replaceState;
  
    history.pushState = function () {
      instaPush.apply(this, arguments);
      redirectIfInstagramReels();
    };
    history.replaceState = function () {
      instaReplace.apply(this, arguments);
      redirectIfInstagramReels();
    };
  
    window.addEventListener('popstate', redirectIfInstagramReels);
    setInterval(redirectIfInstagramReels, 500);
  
    const instaObserver = new MutationObserver(hideInstagramReelsButton);
    instaObserver.observe(document.body, { childList: true, subtree: true });
  });
  