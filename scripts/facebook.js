chrome.storage.sync.get(['blockFacebook'], result => {
  if (!result.blockFacebook) return;

  function incrementCounter() {
    const key = 'blockCountFacebook';
    chrome.storage.sync.get([key], res => {
      const current = res[key] || 0;
      chrome.storage.sync.set({ [key]: current + 1 });
    });
  }

  function hideFacebookReelsSuggestion() {
    // Original selector for feed cards
    const cards = document.querySelectorAll('div[role="feed"] div[class*="x1n2onr6"]');
    cards.forEach(card => {
      const text = card.innerText || '';
      const hasReelLink = card.querySelector('a[href*="/reel/"]');
      if (hasReelLink || /Reels/i.test(text)) {
        if (card.style.display !== 'none') {
          card.style.display = 'none';
          incrementCounter();
        }
      }
    });

    // New selector for specific element structure
    const specificElements = document.querySelectorAll('.x1gslohp.x1e56ztr > div > div > div:nth-of-type(3)');
    specificElements.forEach(element => {
      const text = element.innerText || '';
      const hasReelLink = element.querySelector('a[href*="/reel/"]');
      if (hasReelLink || /Reels/i.test(text)) {
        if (element.style.display !== 'none') {
          element.style.display = 'none';
          incrementCounter();
        }
      }
    });

    // Block any links containing /reel
    const reelLinks = document.querySelectorAll('a[href*="/reel/"]');
    reelLinks.forEach(link => {
      // Hide the closest container that makes sense (could be the link itself or a parent)
      let container = link.closest('div[class*="x1n2onr6"]') || 
                     link.closest('div[role="article"]') || 
                     link.closest('.x1gslohp.x1e56ztr > div > div > div') ||
                     link;
      
      if (container && container.style.display !== 'none') {
        container.style.display = 'none';
        incrementCounter();
      }
    });
  }

  function redirectIfFacebookReels() {
    const path = location.pathname;
    if (path.startsWith('/reels') || path.includes('/reel/')) {
      incrementCounter();
      location.href = 'https://www.facebook.com/';
    }
  }

  redirectIfFacebookReels();
  hideFacebookReelsSuggestion();
  const obs = new MutationObserver(hideFacebookReelsSuggestion);
  obs.observe(document.body, { childList: true, subtree: true });
});