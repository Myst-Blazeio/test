import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Snackbar,
  Alert,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import styled from "@emotion/styled";
import { useNotesPanel } from "../../util/LeftButton.util";

const FloatingNotesBox = styled(Paper)({
  position: "fixed",
  bottom: "100px",
  left: "75%",
  transform: "translateX(-50%)",
  width: "320px",
  height: "440px",
  background: "linear-gradient(145deg, #e6f0ff, #ffffff)",
  borderRadius: "24px",
  boxShadow: "0 10px 40px rgba(0, 89, 255, 0.25)",
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const Header = styled(Box)({
  background: "linear-gradient(to right, #0d47a1, #1976d2)",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 18px",
  fontWeight: 600,
});

const NoteAreaWrapper = styled(Box)({
  position: "relative",
  flexGrow: 1,
  padding: "12px 16px",
});

const NoteField = styled(TextField)({
  width: "100%",
  height: "100%",
  "& .MuiInputBase-root": {
    height: "100%",
    fontSize: "14px",
    backgroundColor: "#f0f7ff",
    borderRadius: "16px",
    padding: "12px",
  },
  "& textarea": {
    height: "100% !important",
  },
});

const EnhanceButton = styled(IconButton)({
  position: "absolute",
  bottom: 18,
  right: 22,
  backgroundColor: "#ffffffdd",
  borderRadius: "50%",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  "&:hover": {
    backgroundColor: "#e3f2fd",
  },
});

const Footer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 18px",
  borderTop: "1px solid #d0d0d0",
  backgroundColor: "#f8fbff",
});

const NotesPanel = ({ onClose }) => {
  const { notes, setNotes, enhanceNote, triggerSnackbar, SnackbarComponent } =
    useNotesPanel();
  const [editable, setEditable] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    const storedNote = localStorage.getItem("userNote") || "";
    setNotes(storedNote);
  }, [setNotes]);

  useEffect(() => {
    return () => {
      localStorage.setItem("userNote", notes);
    };
  }, [notes]);

  const handleSave = async () => {
    try {
      localStorage.setItem("userNote", notes);
      setIsSaved(true);
      setEditable(false);

      const response = await fetch("http://localhost:8080/api/notes/current", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        const text = await response.text();
        triggerSnackbar(`✅ Note saved to backend!`, "success");
        console.log("[BACKEND RESPONSE]", text);
      } else {
        const error = await response.text();
        triggerSnackbar(`❌ Failed to save note: ${error}`, "error");
        console.error("[ERROR RESPONSE]", error);
      }
    } catch (err) {
      triggerSnackbar("🚫 Error saving note to backend.", "error");
      console.error("POST error:", err);
    }
  };

  const handleCancel = () => {
    if (notes !== localStorage.getItem("userNote")) {
      localStorage.setItem("userNote", notes);
    }
    onClose();
  };

  const handleEdit = () => setEditable(true);

  const handleChange = (e) => {
    setNotes(e.target.value);
    setIsSaved(e.target.value === localStorage.getItem("userNote"));
  };

  const handleEnhanceButtonClick = async () => {
    if (!notes.trim()) {
      triggerSnackbar("Cannot enhance empty note.", "warning");
      return;
    }

    try {
      const enhanced = await enhanceNote(notes);
      if (enhanced) {
        setNotes(enhanced);
        triggerSnackbar("Note enhanced!", "success");
      } else {
        triggerSnackbar("No enhancement received.", "info");
      }
    } catch (error) {
      console.error("Enhancement failed:", error);
      triggerSnackbar("Failed to enhance note.", "error");
    }
  };

  return (
    <FloatingNotesBox elevation={6}>
      <Header>
        <Typography variant="subtitle1">Quick Notes</Typography>
        <IconButton size="small" onClick={handleCancel}>
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
      </Header>
      <NoteAreaWrapper>
        <NoteField
          fullWidth
          multiline
          variant="outlined"
          disabled={!editable}
          value={notes}
          onChange={handleChange}
          placeholder="Write your notes here..."
        />
        <EnhanceButton onClick={handleEnhanceButtonClick}>
          <AutoAwesomeOutlinedIcon color="primary" />
        </EnhanceButton>
      </NoteAreaWrapper>
      <Footer>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={handleEdit}
          disabled={editable}
        >
          Take Notes
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: isSaved ? "#43a047" : "#e53935",
            minWidth: "48px",
            minHeight: "40px",
            borderRadius: "12px",
          }}
        >
          <SaveIcon />
        </Button>
      </Footer>

      <Snackbar
        open={triggerSnackbar.open}
        autoHideDuration={5000}
        onClose={triggerSnackbar.handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        TransitionComponent={(props) => <Slide {...props} direction="right" />}
      >
        <Alert
          severity={triggerSnackbar.severity}
          onClose={triggerSnackbar.handleClose}
          action={
            <IconButton
              size="medium"
              onClick={triggerSnackbar.handleClose}
              sx={{ color: "red" }}
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
          {triggerSnackbar.message}
        </Alert>
      </Snackbar>
    </FloatingNotesBox>
  );
};

export default NotesPanel;
