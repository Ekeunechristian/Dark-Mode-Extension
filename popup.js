const STORAGE_KEY = "darkModeSettings";

function getDomain(tab) {
  return new URL(tab.url).hostname;
}

document.getElementById("toggle").onclick = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const domain = getDomain(tab);

  chrome.storage.sync.get(STORAGE_KEY, res => {
    const settings = res[STORAGE_KEY] || { enabled: true, sites: {} };

    settings.sites[domain] = !settings.sites[domain];

    chrome.storage.sync.set({ [STORAGE_KEY]: settings }, () => {
      chrome.tabs.reload(tab.id);
    });
  });
};
