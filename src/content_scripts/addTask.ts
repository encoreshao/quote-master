export const addTask = (request: any) => {
  // Remove any existing form
  const existingForm = document.getElementById(
    "nexus-tab-task-form-container"
  );
  if (existingForm) {
    document.body.removeChild(existingForm);
  }

  // Create form container
  const formContainer = document.createElement("div");
  formContainer.id = "nexus-tab-task-form-container";
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
  title.textContent = "Add to Tasks";
  title.style.marginTop = "0";
  title.style.marginBottom = "20px";
  title.style.fontSize = "18px";
  title.style.fontWeight = "bold";
  form.appendChild(title);

  // Create task text field
  const textLabel = document.createElement("label");
  textLabel.textContent = "Title:";
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
  linkLabel.textContent = "Link (optional):";
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

  // Create description field
  const descLabel = document.createElement("label");
  descLabel.textContent = "Description (optional):";
  descLabel.style.display = "block";
  descLabel.style.marginBottom = "5px";
  descLabel.style.fontWeight = "bold";
  form.appendChild(descLabel);

  const descInput = document.createElement("textarea");
  descInput.style.width = "100%";
  descInput.style.padding = "8px";
  descInput.style.marginBottom = "15px";
  descInput.style.borderRadius = "4px";
  descInput.style.border = "1px solid #ccc";
  descInput.style.minHeight = "80px";
  descInput.style.resize = "vertical";
  form.appendChild(descInput);

  // Create priority selector
  const priorityLabel = document.createElement("label");
  priorityLabel.textContent = "Priority:";
  priorityLabel.style.display = "block";
  priorityLabel.style.marginBottom = "5px";
  priorityLabel.style.fontWeight = "bold";
  form.appendChild(priorityLabel);

  const prioritySelect = document.createElement("select");
  prioritySelect.style.width = "100%";
  prioritySelect.style.padding = "8px";
  prioritySelect.style.marginBottom = "15px";
  prioritySelect.style.borderRadius = "4px";
  prioritySelect.style.border = "1px solid #ccc";

  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  priorities.forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority.value;
    option.textContent = priority.label;
    if (priority.value === "medium") {
      option.selected = true;
    }
    prioritySelect.appendChild(option);
  });

  form.appendChild(prioritySelect);

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
  submitButton.textContent = "Add Task";
  submitButton.style.padding = "8px 16px";
  submitButton.style.border = "none";
  submitButton.style.borderRadius = "4px";
  submitButton.style.backgroundColor = "#4CAF50";
  submitButton.style.color = "white";
  submitButton.style.cursor = "pointer";
  submitButton.onclick = () => {
    // Create task object
    const task = {
      text: textInput.value.trim(),
      link: linkInput.value.trim(),
      description: descInput.value.trim(),
      priority: prioritySelect.value,
    };

    if (task.text === "") {
      chrome.runtime.sendMessage({
        action: "showErrorNotification",
        message: "Title cannot be empty.",
      });
    } else {
      // Send task back to background script
      chrome.runtime.sendMessage({
        action: "addTask",
        task: task,
      });

      // Remove form
      document.body.removeChild(formContainer);

      // Show success notification
      chrome.runtime.sendMessage({
        action: "showSuccessNotification",
        message: "Task added successfully!",
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
