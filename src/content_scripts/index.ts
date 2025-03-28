import { addBookmark } from "./addBookmark";
import { addTask } from "./addTask";
import { showNotification } from "./showNotification";

export {};

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showNotification") {
    showNotification(request.message);
  } else if (request.action === "showTaskForm") {
    addTask(request);

    sendResponse({ success: true });
    return true;
  } else if (request.action === "showBookmarkForm") {
    addBookmark(request);

    sendResponse({ success: true });
    return true;
  }
});
