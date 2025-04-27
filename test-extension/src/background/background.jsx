console.log("🚀 Background service worker loaded!");

// Listen for clicks on the browser action (extension icon)
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Ensure the URL is valid and check if the current tab is a YouTube page
    if (!tab.id || !tab.url) {
      console.warn("⚠️ Invalid tab or URL.");
      return;
    }

    // If the tab is a YouTube page but not a video page (i.e., youtube.com)
    if (
      tab.url.includes("https://www.youtube.com/") ||
      tab.url.includes("http://www.youtube.com/")
    ) {
      // If it's youtube.com/watch, show the floating button
      if (tab.url.includes("youtube.com/watch")) {
        // Inject content script for youtube.com/watch
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content/contentScript.js"],
        });

        console.log("✅ Content script injected.");

        // Send message to toggle the floating button in the content script
        chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_FLOATING_BUTTON" });
      } else {
        // If it's not a video page (youtube.com but not youtube.com/watch), show alert
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const alertDiv = document.createElement("div");
            alertDiv.style.position = "fixed";
            alertDiv.style.top = "20px";
            alertDiv.style.left = "50%";
            alertDiv.style.transform = "translateX(-50%)";
            alertDiv.style.padding = "10px 20px";
            alertDiv.style.backgroundColor = "#f44336";
            alertDiv.style.color = "white";
            alertDiv.style.fontSize = "16px";
            alertDiv.style.fontWeight = "bold";
            alertDiv.style.borderRadius = "5px";
            alertDiv.innerText = "⚠️ This is not a YouTube video page!";
            document.body.appendChild(alertDiv);

            // Remove the alert after 3 seconds
            setTimeout(() => {
              alertDiv.remove();
            }, 3000);
          },
        });
      }
    } else {
      // For non-YouTube pages, show alert
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const alertDiv = document.createElement("div");
          alertDiv.style.position = "fixed";
          alertDiv.style.top = "20px";
          alertDiv.style.left = "50%";
          alertDiv.style.transform = "translateX(-50%)";
          alertDiv.style.padding = "10px 20px";
          alertDiv.style.backgroundColor = "#f44336";
          alertDiv.style.color = "white";
          alertDiv.style.fontSize = "16px";
          alertDiv.style.fontWeight = "bold";
          alertDiv.style.borderRadius = "5px";
          alertDiv.innerText = "⚠️ This is not a YouTube video page!";
          document.body.appendChild(alertDiv);

          // Remove the alert after 3 seconds
          setTimeout(() => {
            alertDiv.remove();
          }, 3000);
        },
      });
    }
  } catch (error) {
    console.error("❌ Injection or Messaging error:", error);
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if the message is requesting the YouTube URL
  if (message.type === "FETCH_YOUTUBE_URL") {
    // Query the active tab to get its URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      // Only respond if the active tab is a YouTube video page
      if (
        activeTab &&
        activeTab.url &&
        activeTab.url.includes("youtube.com/watch")
      ) {
        sendResponse({ url: activeTab.url });
      } else {
        sendResponse({ url: null });
      }
    });

    // Return true to indicate we are using an asynchronous response
    return true;
  }
});
