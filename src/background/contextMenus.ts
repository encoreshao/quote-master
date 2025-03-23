//No message to send or receive, only to trigger contextMenu on startup

import { generateId, TaskDefaultConfig } from "../types/Task";

const APP_CONTEXT_MENU_ID = "quote_master_add_to_tasks";
const APP_CONTEXT_MENU_TITLE = "Add to Tasks";

chrome.contextMenus.create({
  id: APP_CONTEXT_MENU_ID,
  title: APP_CONTEXT_MENU_TITLE,
  contexts: ["page"],
});

const updateContextMenus = (url?: string) => {
  chrome.contextMenus.update(APP_CONTEXT_MENU_ID, {
    visible: true,
    title: APP_CONTEXT_MENU_TITLE,
  });
};

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === APP_CONTEXT_MENU_ID) {
    if (!tab || !tab.url || !tab.id) {
      return;
    }

    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split("T")[0];

    // Create a new task with the page URL and title
    const newTask = {
      id: generateId(), // Generate unique ID
      text: tab.title?.split(" · ")[0] || "Unknown task",
      link: tab.url,
      completed: false,
      date: currentDate,
      status: TaskDefaultConfig.status,
      priority: TaskDefaultConfig.priority,
    };

    // Get existing tasks from storage, add the new task, and save back to storage
    chrome.storage.local.get(["tasks"], (result) => {
      const tasks = Array.isArray(result.tasks) ? result.tasks : [];
      tasks.push(newTask);
      chrome.storage.local.set({ tasks }, () => {
        console.log("Task added:", newTask);

        // Show a notification to the user
        try {
          // Create a simple notification using the chrome.tabs API to send a message to the active tab
          chrome.tabs.sendMessage(tab.id as number, {
            action: "showNotification",
            message: "Task added successfully!",
          });
        } catch (error) {
          console.log("Could not show notification:", error);
        }
      });
    });

    updateContextMenus(tab.url);
  }
});

export { updateContextMenus };
