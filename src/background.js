// example: set a default value on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ foo: "bar" });
}); 