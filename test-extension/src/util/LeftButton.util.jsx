import { useState } from "react";
import axios from "axios";
import { Snackbar, Alert, Slide, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { baseAPIurl } from "../config";

export const useNotesPanel = () => {
  const [notes, setNotes] = useState(""); // State for storing notes

  // Snackbar state for displaying feedback messages
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Function to trigger the snackbar
  const triggerSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  // Function to fetch notes from the backend
  const fetchNotesFromBackend = async () => {
    try {
      const response = await axios.get(`${baseAPIurl}api/notes/result`);
      if (response.status === 200 && response.data) {
        setNotes(response.data);
        localStorage.setItem("savedNotes", response.data); // cache locally
        triggerSnackbar("✅ Enhanced notes fetched successfully.", "success");
        return response.data;
      } else {
        triggerSnackbar("⚠️ No enhanced notes returned.", "warning");
        return null;
      }
    } catch (error) {
      console.error("[ERROR] GET /api/notes/result:", error);
      triggerSnackbar("⚠️ Failed to fetch enhanced notes.", "error");
      return null;
    }
  };

  // Function to enhance notes by sending them to the backend
  const enhanceNote = async (noteText) => {
    if (!noteText.trim()) {
      triggerSnackbar("⚠️ Cannot enhance an empty note.", "warning");
      return null;
    }

    try {
      triggerSnackbar("✨ Sending note for enhancement...", "info");
      const response = await axios.post(`${baseAPIurl}api/notes/enhance`, {
        notes: noteText,
      });

      if (response.status === 200) {
        triggerSnackbar(
          "⏳ Enhancement complete. Fetching results...",
          "success"
        );
        const enhanced = await fetchNotesFromBackend(); // Fetch the result
        return enhanced;
      } else {
        triggerSnackbar("❌ Enhancement failed.", "error");
        return null;
      }
    } catch (error) {
      console.error("[ERROR] POST /api/notes/enhance:", error);
      triggerSnackbar("❌ Error enhancing note.", "error");
      return null;
    }
  };

  // Snackbar component to display feedback messages
  const SnackbarComponent = () => {
    const handleClose = () => {
      setSnackbar({ ...snackbar, open: false });
    };

    return (
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }} // Bottom-left position
        TransitionComponent={(props) => <Slide {...props} direction="right" />}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleClose}
          sx={{
            backgroundColor: "#333",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px",
            padding: "10px 20px",
          }}
          action={
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{ color: "#fff" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    );
  };

  return {
    notes,
    setNotes,
    enhanceNote, // Make the enhanceNote function available
    triggerSnackbar, // Make the snackbar trigger function available
    SnackbarComponent, // Make the Snackbar component available
  };
};
