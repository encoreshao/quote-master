export {};
// import { version as manifestVersion } from "../manifest.json";

function openChromeInternalPage(chromeExtURL: string) {
  chrome.tabs.query({}, function (tabs: any) {
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].url === chromeExtURL) {
        chrome.tabs.update(tabs[i].id, { active: true });
        return;
      }
    }
    chrome.tabs.create({ url: chromeExtURL, active: true });
  });
}

// chrome.storage.onChanged.addListener((changes, namespace) => {
//   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//     console.log(
//       `Storage key "${key}" in namespace "${namespace}" changed.`,
//       `Old value was "${oldValue}", new value is "${newValue}".`
//     );
//   }
// });

// chrome.storage.local.remove(
//   ["pinBookmarks", "backgroundUrl", "gitlab", "enabledGitlab"],
//   () => {}
// );

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getBookmarks") {
    chrome.bookmarks.getTree((bookmarkTreeNodes: any) => {
      sendResponse(bookmarkTreeNodes);
    });
    return true; // Keeps the message channel open for sendResponse
  } else if (request.action === "getBookmarkById") {
    chrome.bookmarks.get(request.id, (bookmark) => {
      sendResponse({ bookmark });
    });
    return true; // Keep the message channel open for sendResponse
  } else if (
    request.action === "downloads" ||
    request.action === "extensions"
  ) {
    openChromeInternalPage("chrome://" + request.action + "/");
  }
});
