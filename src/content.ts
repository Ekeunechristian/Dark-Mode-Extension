import tinycolor from "tinycolor2";

const STORAGE_KEY = "darkModeSettings";

function getDomain(): string {
  return location.hostname;
}

function injectCSS() {
  if (document.getElementById("dm-style")) return;

  const link = document.createElement("link");
  link.id = "dm-style";
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("dark.css");
  document.head.appendChild(link);
}

function applyDarkMode(enable: boolean) {
  if (enable) {
    injectCSS();
    document.documentElement.setAttribute("data-darkmode", "on");
  } else {
    document.documentElement.removeAttribute("data-darkmode");
  }
}

/* SMART FIX: only fix unreadable inline styles */
function fixContrast(el: HTMLElement) {
  const style = getComputedStyle(el);
  const bg = tinycolor(style.backgroundColor);
  const text = tinycolor(style.color);

  if (!bg.isValid() || !text.isValid()) return;

  const contrast = tinycolor.readability(text, bg);
  if (contrast < 4.5) {
    el.style.color = "#e0e0e0";
  }
}

function observeDOM() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node instanceof HTMLElement) {
          fixContrast(node);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

/* INIT */
chrome.storage.sync.get(STORAGE_KEY, res => {
  const settings = res[STORAGE_KEY] || {
    enabled: true,
    sites: {}
  };

  const domain = getDomain();
  const enabledForSite = settings.sites[domain] ?? settings.enabled;

  applyDarkMode(enabledForSite);

  if (enabledForSite) observeDOM();
});
