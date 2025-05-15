const toggle = document.getElementById('darkModeToggle');

function updateToggleUI(enabled) {
  toggle.checked = enabled;
}

async function getDarkModeStatus() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['darkModeEnabled'], (result) => {
      resolve(result.darkModeEnabled ?? true);
    });
  });
}

async function setDarkModeStatus(enabled) {
  chrome.storage.local.set({ darkModeEnabled: enabled });
}

toggle.addEventListener('change', async () => {
  const enabled = toggle.checked;
  await setDarkModeStatus(enabled);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: enabled ? 'enable' : 'disable' });
  });
});

(async () => {
  const enabled = await getDarkModeStatus();
  updateToggleUI(enabled);
})();
