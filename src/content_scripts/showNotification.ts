export const showNotification = (request: any) => {
  // Create and show a notification element
  const notification = document.createElement("div");
  notification.style.position = "fixed";
  notification.style.top = "20px";
  notification.style.right = "20px";
  notification.style.backgroundColor = "#4CAF50";
  notification.style.color = "white";
  notification.style.padding = "16px";
  notification.style.borderRadius = "4px";
  notification.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  notification.style.zIndex = "9999";
  notification.style.transition = "opacity 0.5s";
  notification.textContent = request.message;

  // Add the notification to the page
  document.body.appendChild(notification);

  // Remove the notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
};
