// src/util/TopButton.util.js
import axios from "axios";
import React from "react";
import { Snackbar, Alert, Slide, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { baseAPIurl } from "../config";

// Snackbar state management
let snackbarState = {
  open: false,
  message: "",
  severity: "info",
};

let setSnackbarState;

export const setSnackbar = (message, severity = "info") => {
  snackbarState = { open: true, message, severity };
  setSnackbarState(snackbarState);
};

let isProcessing = false;

export const handleFetchUrl = async (setLoading) => {
  if (isProcessing) {
    console.warn("[WARN] Summarization already in progress.");
    setSnackbar("Summarization already in progress. Please wait.", "warning");
    return;
  }

  isProcessing = true;
  try {
    setLoading(true);

    chrome.runtime.sendMessage(
      { type: "FETCH_YOUTUBE_URL" },
      async (response) => {
        if (chrome.runtime.lastError) {
          console.error("[ERROR] Message failed:", chrome.runtime.lastError);
          setSnackbar("Failed to fetch URL.", "error");
          setLoading(false);
          isProcessing = false;
          return;
        }

        if (!response || !response.url) {
          console.warn("[WARN] No YouTube video detected.");
          setSnackbar("No YouTube video detected on active tab.", "warning");
          setLoading(false);
          isProcessing = false;
          return;
        }

        console.log("[DEBUG] YouTube URL fetched:", response.url);
        setSnackbar("Summarizing video...", "info");

        try {
          const postResponse = await axios.post(`${baseAPIurl}api/summarize`, {
            youtubeUrl: response.url,
          });

          console.log("[DEBUG] POST response from backend:", postResponse.data);

          if (postResponse.status === 200 || postResponse.status === 201) {
            setSnackbar("PDF generation started...", "success");
            await downloadSummary();
            setSnackbar("PDF downloaded successfully.", "success");
          } else {
            console.warn(
              "[WARN] Unexpected backend status:",
              postResponse.status
            );
            setSnackbar("Unexpected backend response.", "warning");
          }
        } catch (error) {
          console.error("[ERROR] Failed to POST to backend:", error);
          setSnackbar("Failed to send URL to backend.", "error");
        } finally {
          setLoading(false);
          isProcessing = false;
        }
      }
    );
  } catch (error) {
    console.error("[FATAL ERROR]", error);
    setSnackbar("Unexpected error.", "error");
    setLoading(false);
    isProcessing = false;
  }
};

// Helper to download the PDF
const downloadSummary = async () => {
  try {
    const response = await axios.get(`${baseAPIurl}api/downloadSummary`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "summary.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("[DEBUG] Summary PDF downloaded successfully.");
  } catch (error) {
    console.error("[ERROR] Failed to download PDF:", error);
  }
};

// Snackbar component with Slide transition
export const SnackbarComponent = ({ snackbar, setSnackbar }) => {
  const handleClose = () => {
    setSnackbar({ open: false, message: "", severity: "info" });
  };

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      Transition={<Slide direction="right" />} // Slide from the left side
    >
      <Alert
        severity={snackbar.severity}
        onClose={handleClose}
        action={
          <IconButton
            size="medium"
            onClick={handleClose}
            sx={{
              color: "red",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{
          border: "1px solid white",
          borderRadius: "8px",
          backgroundColor: "black",
          color: "white",
          fontSize: "16px",
          padding: "10px 20px",
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

// Initialize snackbar setter
export const initSnackbarState = (setState) => {
  setSnackbarState = setState;
};
