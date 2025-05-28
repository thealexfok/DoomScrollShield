chrome.runtime.onInstalled.addListener(() => {
    const defaults = {
      blockYoutube: true,
      blockFacebook: true,
      blockInstagram: true,
      blockTikTok: true,
      blockCountYoutube: 0,
      blockCountFacebook: 0,
      blockCountInstagram: 0,
      blockCountTikTok: 0,
      advancedMode: false
    };
    chrome.storage.sync.set(defaults);
  });
  