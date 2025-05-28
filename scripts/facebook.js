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
      const cards = document.querySelectorAll('div[role="feed"] div[class*="x1n2onr6"]');
      cards.forEach(card => {
        const text = card.innerText || '';
        const hasReelLink = card.querySelector('a[href*="/reel/"]');
        if (hasReelLink || /Reels/i.test(text)) {
          if (card.style.display !== 'none') {
            card.style.display = 'none';
            incrementCounter(); // only increment if we hid it
          }
        }
      });
    }
  
    hideFacebookReelsSuggestion();
    const obs = new MutationObserver(hideFacebookReelsSuggestion);
    obs.observe(document.body, { childList: true, subtree: true });
  });
  