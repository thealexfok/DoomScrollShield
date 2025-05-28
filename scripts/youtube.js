function incrementCounter() {
    const key = 'blockCountYoutube';
    chrome.storage.sync.get([key], res => {
      const current = res[key] || 0;
      chrome.storage.sync.set({ [key]: current + 1 });
    });
  }
  
  function redirectIfShorts() {
    if (location.pathname.startsWith('/shorts')) {
      incrementCounter();
      location.href = 'https://www.youtube.com/';
    }
  }
  
  function hideShortsElements() {
    document.querySelectorAll('ytd-rich-section-renderer').forEach(el => {
      if (el.style.display !== 'none') {
        el.remove();
        incrementCounter();
      }
    });
  
    document.querySelectorAll('ytd-guide-entry-renderer').forEach(el => {
      const label = el.textContent.trim().toLowerCase();
      if (label === 'shorts') {
        el.remove();
        incrementCounter();
      }
    });
  }
  
  redirectIfShorts();
  hideShortsElements();
  
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function () {
    originalPushState.apply(this, arguments);
    redirectIfShorts();
    hideShortsElements();
  };
  history.replaceState = function () {
    originalReplaceState.apply(this, arguments);
    redirectIfShorts();
    hideShortsElements();
  };
  
  window.addEventListener('popstate', () => {
    redirectIfShorts();
    hideShortsElements();
  });
  
  const observer = new MutationObserver(() => {
    redirectIfShorts();
    hideShortsElements();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  