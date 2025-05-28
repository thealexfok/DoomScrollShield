const sites = ['Youtube', 'Facebook', 'Instagram', 'TikTok'];

const advancedModeToggle = document.getElementById('advancedModeToggle');
const totalBlocksElem = document.getElementById('totalBlocks');

// Utility to update count badges UI
function updateCountBadges(counts, isAdvanced) {
  sites.forEach(site => {
    const countElem = document.getElementById(`count-block${site}`);
    if (!countElem) return;

    if (isAdvanced) {
      countElem.style.display = 'inline-block';
      countElem.textContent = counts[`blockCount${site}`] || 0;
    } else {
      countElem.style.display = 'none';
    }
  });
}

// Utility to update total block count UI
function updateTotalBlocks(counts, isAdvanced) {
  if (isAdvanced) {
    const total = sites.reduce((sum, site) => sum + (counts[`blockCount${site}`] || 0), 0);
    totalBlocksElem.textContent = total;
  } else {
    totalBlocksElem.textContent = '0';
  }
}

// Load and initialize checkboxes and counts
function initialize() {
  // Load advanced mode state first
  chrome.storage.sync.get(['advancedMode'], result => {
    const isAdvanced = result.advancedMode ?? false;
    advancedModeToggle.checked = isAdvanced;
    document.body.classList.toggle('advanced', isAdvanced);

    // Load block toggles
    sites.forEach(site => {
      const checkbox = document.getElementById(`block${site}`);
      chrome.storage.sync.get([`block${site}`], res => {
        const isBlocked = res[`block${site}`];
        checkbox.checked = isBlocked === undefined ? true : isBlocked;
        if (isBlocked === undefined) {
          chrome.storage.sync.set({ [`block${site}`]: true });
        }
      });
      checkbox.addEventListener('change', () => {
        chrome.storage.sync.set({ [`block${site}`]: checkbox.checked });
      });
    });

    // Load block counts and update UI
    chrome.storage.sync.get(sites.map(site => `blockCount${site}`), counts => {
      updateCountBadges(counts, isAdvanced);
      updateTotalBlocks(counts, isAdvanced);
    });
  });
}

// Listen for advanced mode toggle changes
advancedModeToggle.addEventListener('change', () => {
  const enabled = advancedModeToggle.checked;
  chrome.storage.sync.set({ advancedMode: enabled });
  document.body.classList.toggle('advanced', enabled);

  chrome.storage.sync.get(sites.map(site => `blockCount${site}`), counts => {
    updateCountBadges(counts, enabled);
    updateTotalBlocks(counts, enabled);
  });
});

// Listen to storage changes to dynamically update counts
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    let needUpdate = false;
    const counts = {};
    for (const key in changes) {
      if (key.startsWith('blockCount')) {
        counts[key] = changes[key].newValue;
        needUpdate = true;
      }
      if (key === 'advancedMode') {
        const enabled = changes[key].newValue;
        advancedModeToggle.checked = enabled;
        document.body.classList.toggle('advanced', enabled);
      }
    }
    if (needUpdate) {
      const isAdvanced = advancedModeToggle.checked;
      updateCountBadges(counts, isAdvanced);
      updateTotalBlocks(counts, isAdvanced);
    }
  }
});

// Initialize UI on load
initialize();
