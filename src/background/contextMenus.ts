//No message to send or receive, only to trigger contextMenu on startup
import { short_name as shortName } from "../resources/manifest.json";
import { TaskDefaultConfig } from "../types/Task";

const APP_CONTEXT_MENU_ID = "quote_master_menu";
const APP_CONTEXT_ADD_TO_TASKS = "quote_master_menu-add_to_tasks";
const APP_CONTEXT_ADD_TO_BOOKMARKS = "quote_master_menu-add_to_bookmarks";

const parent = chrome.contextMenus.create({
  id: APP_CONTEXT_MENU_ID,
  title: shortName,
  contexts: ["page"],
});

chrome.contextMenus.create({
  id: APP_CONTEXT_ADD_TO_TASKS,
  title: "Add to Tasks",
  parentId: parent,
  contexts: ["page"],
});

chrome.contextMenus.create({
  id: APP_CONTEXT_ADD_TO_BOOKMARKS,
  title: "Add to Bookmarks",
  parentId: parent,
  contexts: ["page"],
});

const updateContextMenus = (url?: string) => {
  chrome.contextMenus.update(APP_CONTEXT_MENU_ID, {
    visible: url?.startsWith("http") || false,
    title: shortName,
  });
};

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (
    info.menuItemId === APP_CONTEXT_ADD_TO_TASKS ||
    info.menuItemId === APP_CONTEXT_ADD_TO_BOOKMARKS
  ) {
    if (!tab || !tab.url || !tab.id) {
      return;
    }

    const actionName =
      info.menuItemId === APP_CONTEXT_ADD_TO_TASKS
        ? "showTaskForm"
        : "showBookmarkForm";

    // Show the task/bookmark form in the content script
    chrome.tabs.sendMessage(
      tab.id,
      {
        action: actionName,
        url: tab.url,
        title: tab.title || "New task from webpage",
      },
      (response: any) => {
        if (chrome.runtime.lastError) {
          console.error("Error showing task form:", chrome.runtime.lastError);
        }
      }
    );

    updateContextMenus(tab.url);
  }
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "addTask") {
    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split("T")[0];

    // Create a new task with the form data
    const newTask = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2), // Generate unique ID
      text: request.task.text || "New task",
      link: request.task.link || "",
      completed: false,
      date: currentDate,
      status: TaskDefaultConfig.status,
      priority: TaskDefaultConfig.priority,
      description: request.task.description || "",
    };

    // Get existing tasks from storage, add the new task, and save back to storage
    chrome.storage.local.get(["tasks"], (result) => {
      const tasks = Array.isArray(result.tasks) ? result.tasks : [];
      tasks.push(newTask);
      chrome.storage.local.set({ tasks }, () => {
        console.log("Task added:", newTask);
      });
    });
  } else if (request.action === "addBookmark") {
    const bookmarkTitle = request.bookmark.text;
    const bookmarkUrl = request.bookmark.link;
    const parentId = request.bookmark.parentId || "1"; // Default to Bookmarks Bar if not specified

    // First check if a bookmark with this URL already exists
    chrome.bookmarks.search({ url: bookmarkUrl }, (existingBookmarks) => {
      if (chrome.runtime.lastError) {
        console.error("Error searching bookmarks:", chrome.runtime.lastError);
        return;
      }

      // If bookmark with this URL already exists, skip adding it
      if (existingBookmarks && existingBookmarks.length > 0) {
        console.log("Bookmark already exists:", bookmarkUrl);

        // Notify the user that the bookmark already exists
        if (sender.tab && sender.tab.id) {
          chrome.tabs.sendMessage(sender.tab.id, {
            action: "showNotification",
            message: "Bookmark already exists",
          });
        }
        return;
      }

      // Add the bookmark to Chrome's bookmarks
      chrome.bookmarks.create(
        {
          parentId: parentId,
          title: bookmarkTitle,
          url: bookmarkUrl,
        },
        (newBookmark) => {
          if (chrome.runtime.lastError) {
            console.error("Error creating bookmark:", chrome.runtime.lastError);
            return;
          }

          console.log("Bookmark added:", newBookmark);

          // Also store in local storage for backward compatibility
          chrome.storage.local.get(["bookmarks"], (result) => {
            const bookmarks = Array.isArray(result.bookmarks)
              ? result.bookmarks
              : [];
            bookmarks.push({
              text: bookmarkTitle,
              link: bookmarkUrl,
              parentId: parentId,
            });
            chrome.storage.local.set({ bookmarks }, () => {
              console.log("Bookmark also added to local storage");
            });
          });

          // Show success notification
          if (sender.tab && sender.tab.id) {
            chrome.tabs.sendMessage(sender.tab.id, {
              action: "showNotification",
              message: "Bookmark added successfully",
            });
          }
        }
      );
    });
  } else if (request.action === "showNotificationMessage") {
    // Show a notification in the active tab
    if (sender.tab && sender.tab.id) {
      chrome.tabs.sendMessage(sender.tab.id, {
        action: "showNotification",
        message: request.message,
      });
    }
  }
});

export { updateContextMenus };
