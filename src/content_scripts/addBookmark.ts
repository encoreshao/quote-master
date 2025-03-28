export const addBookmark = (request: any) => {
  // Remove any existing form
  const existingForm = document.getElementById(
    "quote-master-bookmark-form-container"
  );
  if (existingForm) {
    document.body.removeChild(existingForm);
  }

  // Create form container
  const formContainer = document.createElement("div");
  formContainer.id = "quote-master-bookmark-form-container";
  formContainer.style.position = "fixed";
  formContainer.style.top = "0";
  formContainer.style.left = "0";
  formContainer.style.width = "100%";
  formContainer.style.height = "100%";
  formContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  formContainer.style.display = "flex";
  formContainer.style.justifyContent = "center";
  formContainer.style.alignItems = "center";
  formContainer.style.zIndex = "10000";

  // Create form
  const form = document.createElement("div");
  form.style.backgroundColor = "white";
  form.style.padding = "20px";
  form.style.borderRadius = "8px";
  form.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
  form.style.width = "500px";
  form.style.maxWidth = "90%";
  form.style.maxHeight = "90vh";
  form.style.overflowY = "auto";

  // Create form title
  const title = document.createElement("h2");
  title.textContent = "Add to Bookmarks";
  title.style.marginTop = "0";
  title.style.marginBottom = "20px";
  title.style.fontSize = "18px";
  title.style.fontWeight = "bold";
  form.appendChild(title);

  // Create task text field
  const textLabel = document.createElement("label");
  textLabel.textContent = "Name";
  textLabel.style.display = "block";
  textLabel.style.marginBottom = "5px";
  textLabel.style.fontWeight = "bold";
  form.appendChild(textLabel);

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.value = request.title || "";
  textInput.style.width = "95%";
  textInput.style.padding = "8px";
  textInput.style.marginBottom = "15px";
  textInput.style.borderRadius = "4px";
  textInput.style.border = "1px solid #ccc";
  form.appendChild(textInput);

  // Create link field
  const linkLabel = document.createElement("label");
  linkLabel.textContent = "URL";
  linkLabel.style.display = "block";
  linkLabel.style.marginBottom = "5px";
  linkLabel.style.fontWeight = "bold";
  form.appendChild(linkLabel);

  const linkInput = document.createElement("input");
  linkInput.type = "text";
  linkInput.value = request.url || "";
  linkInput.style.width = "100%";
  linkInput.style.padding = "8px";
  linkInput.style.marginBottom = "15px";
  linkInput.style.borderRadius = "4px";
  linkInput.style.border = "1px solid #ccc";
  form.appendChild(linkInput);

  // Create folder selection field
  const folderLabel = document.createElement("label");
  folderLabel.textContent = "Folder:";
  folderLabel.style.display = "block";
  folderLabel.style.marginBottom = "5px";
  folderLabel.style.fontWeight = "bold";
  form.appendChild(folderLabel);

  const folderSelect = document.createElement("select");
  folderSelect.style.width = "100%";
  folderSelect.style.padding = "8px";
  folderSelect.style.marginBottom = "15px";
  folderSelect.style.borderRadius = "4px";
  folderSelect.style.border = "1px solid #ccc";

  // Add loading option
  const loadingOption = document.createElement("option");
  loadingOption.value = "";
  loadingOption.textContent = "Loading folders...";
  folderSelect.appendChild(loadingOption);
  form.appendChild(folderSelect);

  // Define bookmark node type
  interface BookmarkNode {
    id: string;
    title: string;
    url?: string;
    parentId?: string;
    children?: BookmarkNode[];
  }

  // Define folder type
  interface BookmarkFolder {
    id: string;
    title: string;
    parentId?: string;
  }

  // Function to extract folders from bookmark tree
  const extractFolders = (
    nodes: BookmarkNode[],
    parentName = ""
  ): BookmarkFolder[] => {
    let folders: BookmarkFolder[] = [];

    for (const node of nodes) {
      // Skip the "Bookmarks Bar" and "Other Bookmarks" root folders from the display name
      const isRoot =
        !parentName &&
        (node.id === "1" || // Bookmarks Bar
          node.id === "2"); // Other Bookmarks

      const folderName = isRoot
        ? node.title
        : parentName
        ? `${parentName} > ${node.title}`
        : node.title;

      if (!node.url) {
        // It's a folder
        folders.push({
          id: node.id,
          title: folderName,
          parentId: node.parentId,
        });

        if (node.children) {
          folders = folders.concat(extractFolders(node.children, folderName));
        }
      }
    }

    return folders;
  };

  // Fetch bookmark folders
  chrome.runtime.sendMessage(
    { action: "getBookmarks" },
    (bookmarkTreeNodes: BookmarkNode[]) => {
      // Extract folders from the bookmark tree
      const folders: BookmarkFolder[] = extractFolders(bookmarkTreeNodes);

      // Clear the loading option
      folderSelect.innerHTML = "";

      // Add default option (Bookmarks Bar)
      const defaultOption = document.createElement("option");
      defaultOption.value = "1"; // Bookmarks Bar ID
      defaultOption.textContent = "Bookmarks Bar";
      folderSelect.appendChild(defaultOption);

      // Add all folders to the select element
      folders.forEach((folder: BookmarkFolder) => {
        const option = document.createElement("option");
        option.value = folder.id;
        option.textContent = folder.title;
        folderSelect.appendChild(option);
      });
    }
  );

  // Create button container
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "flex-end";
  buttonContainer.style.gap = "10px";
  buttonContainer.style.marginTop = "20px";

  // Create cancel button
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.style.padding = "8px 16px";
  cancelButton.style.border = "none";
  cancelButton.style.borderRadius = "4px";
  cancelButton.style.backgroundColor = "#f1f1f1";
  cancelButton.style.cursor = "pointer";
  cancelButton.onclick = () => {
    document.body.removeChild(formContainer);
  };
  buttonContainer.appendChild(cancelButton);

  // Create submit button
  const submitButton = document.createElement("button");
  submitButton.textContent = "Add Bookmark";
  submitButton.style.padding = "8px 16px";
  submitButton.style.border = "none";
  submitButton.style.borderRadius = "4px";
  submitButton.style.backgroundColor = "#4CAF50";
  submitButton.style.color = "white";
  submitButton.style.cursor = "pointer";
  submitButton.onclick = () => {
    // Create bookmark object
    const bookmark = {
      text: textInput.value.trim(),
      link: linkInput.value.trim(),
      parentId: folderSelect.value, // Add the selected folder ID
    };

    if (bookmark.text === "" || bookmark.link === "") {
      // Show error notification if name or URL is empty
      chrome.runtime.sendMessage({
        action: "showSuccessNotification",
        message: "Please enter a name and URL for the bookmark.",
      });
    } else {
      // Send bookmark back to background script
      chrome.runtime.sendMessage({
        action: "addBookmark",
        bookmark: bookmark,
      });

      // Remove form
      document.body.removeChild(formContainer);

      // Show success notification
      chrome.runtime.sendMessage({
        action: "showSuccessNotification",
        message: "Bookmark added successfully!",
      });
    }
  };
  buttonContainer.appendChild(submitButton);

  form.appendChild(buttonContainer);
  formContainer.appendChild(form);
  document.body.appendChild(formContainer);

  // Focus on the title input
  setTimeout(() => {
    textInput.focus();
  }, 100);
};
