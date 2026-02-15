/* eslint-disable import/first */
export {};
import { createContextMenus, updateContextMenus } from "./contextMenus";

// Create context menus once on install/update (not on every SW wake)
chrome.runtime.onInstalled.addListener(() => {
  createContextMenus();
});

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

chrome.tabs.onUpdated.addListener((tabId, { url }) => {
  if (url) {
    updateContextMenus(url);
  }
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, (tab) => {
    updateContextMenus(tab.url);
  });
});

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
