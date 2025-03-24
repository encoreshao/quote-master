//No message to send or receive, only to trigger contextMenu on startup
import { name as appName } from "../resources/manifest.json";
import { TaskDefaultConfig } from "../types/Task";

const APP_CONTEXT_MENU_ID = "quote_master_add_to_tasks";
const APP_CONTEXT_MENU_TITLE = `${appName}: Add to Tasks`;

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

    // Show the task form in the content script
    chrome.tabs.sendMessage(
      tab.id,
      {
        action: "showTaskForm",
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
  } else if (request.action === "showSuccessNotification") {
    // Show a notification in the active tab
    if (sender.tab && sender.tab.id) {
      chrome.tabs.sendMessage(sender.tab.id, {
        action: "showNotification",
        message: "Task added successfully!",
      });
    }
  }
});

export { updateContextMenus };
