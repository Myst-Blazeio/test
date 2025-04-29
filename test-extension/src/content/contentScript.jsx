// content/contentScript.js
import React from "react";
import { createRoot } from "react-dom/client";
import FloatingButton from "../components/button/FloatingButton";

let root = null; // Persist root across events

function injectApp() {
  if (document.getElementById("floating-root")) return;

  const rootDiv = document.createElement("div");
  rootDiv.id = "floating-root";
  document.body.appendChild(rootDiv);

  root = createRoot(rootDiv);
  root.render(<FloatingButton />);
}

function removeApp() {
  const existingRootDiv = document.getElementById("floating-root");
  if (existingRootDiv && root) {
    root.unmount();
    root = null;
    existingRootDiv.remove();
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TOGGLE_FLOATING_BUTTON") {
    if (document.getElementById("floating-root")) {
      removeApp();
    } else {
      injectApp();
    }
  }
});
