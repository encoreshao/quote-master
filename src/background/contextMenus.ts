/// <reference types="chrome"/>
import { APP } from '../utils/common';

const contextMenuId = "nexusTab";
const addToTasksId = "addToTasks";
const addToBookmarksId = "addToBookmarks";

chrome.contextMenus.create({
  id: contextMenuId,
  title: APP.shortName,
  contexts: ["all"],
});

chrome.contextMenus.create({
  id: addToTasksId,
  parentId: contextMenuId,
  title: "Add to Tasks",
  contexts: ["all"],
});

chrome.contextMenus.create({
  id: addToBookmarksId,
  parentId: contextMenuId,
  title: "Add to Bookmarks",
  contexts: ["all"],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === addToTasksId && tab?.id) {
    chrome.tabs.sendMessage(tab.id, {
      action: "addTask",
      data: {
        text: info.selectionText || tab.title || "",
        link: info.pageUrl || tab.url || "",
      },
    });
  }

  if (info.menuItemId === addToBookmarksId && tab?.id) {
    chrome.tabs.sendMessage(tab.id, {
      action: "addBookmark",
      data: {
        title: tab.title || "",
        url: tab.url || info.pageUrl || "",
      },
    });
  }
});

export function updateContextMenus(url: string | undefined) {
  const isInternalPage = url?.startsWith("chrome://");
  chrome.contextMenus.update(contextMenuId, {
    enabled: !isInternalPage,
  });
}
