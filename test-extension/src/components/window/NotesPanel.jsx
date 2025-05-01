import React, { useEffect, forwardRef } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import UndoIcon from "@mui/icons-material/Undo";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import styled from "@emotion/styled";
import { useNotesPanel } from "../../util/LeftButton.util"; // Updated import path

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
  display: "flex",
  flexDirection: "column",
});

const NoteField = styled(TextField)({
  width: "100%",
  height: "100%",
  overflowY: "auto",
  "& .MuiInputBase-root": {
    height: "100%",
    fontSize: "14px",
    backgroundColor: "#f0f7ff",
    borderRadius: "16px",
    padding: "12px",
    alignItems: "flex-start",
  },
  "& textarea": {
    height: "100% !important",
    overflowY: "auto !important",
  },
});

const EnhanceButton = styled(IconButton)(({ disabled }) => ({
  position: "absolute",
  bottom: 18,
  right: 22,
  width: 44,
  height: 44,
  backgroundColor: "#ffffff",
  opacity: 1,
  borderRadius: "50%",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  pointerEvents: disabled ? "none" : "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    backgroundColor: "#e3f2fd",
  },
  "& .MuiCircularProgress-root": {
    position: "absolute",
  },
}));

const Footer = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: "14px 18px",
  borderTop: "1px solid #d0d0d0",
  backgroundColor: "#f8fbff",
});

const NotesPanel = forwardRef(({ onClose }, ref) => {
  const {
    notes,
    setNotes,
    lastSavedNote,
    setLastSavedNote,
    isSaved,
    setIsSaved,
    isEnhancing,
    setIsEnhancing,
    handleSaveNote,
    handleResetNote,
    handleUndoNote,
    handleCopyNote,
    enhanceNote,
  } = useNotesPanel(); // Using the updated hook

  useEffect(() => {
    const storedNote = localStorage.getItem("userNote") || "";
    setNotes(storedNote);
    setLastSavedNote(storedNote);
  }, [setNotes, setLastSavedNote]);

  useEffect(() => {
    return () => {
      localStorage.setItem("userNote", notes);
    };
  }, [notes]);

  const handleChange = (e) => {
    setNotes(e.target.value);
    setIsSaved(e.target.value === lastSavedNote);
  };

  const handleEnhanceButtonClick = async () => {
    if (isEnhancing || !notes.trim()) return;

    try {
      setIsEnhancing(true);
      const enhanced = await enhanceNote(notes);
      if (enhanced) {
        setNotes(enhanced);
        setIsSaved(false);
        triggerSnackbar("✨ Note enhanced!", "success");
      } else {
        triggerSnackbar("No enhancement received.", "info");
      }
    } catch (error) {
      triggerSnackbar("Failed to enhance note.", "error");
    } finally {
      setIsEnhancing(false);
    }
  };

  const isNoteEmpty = !notes.trim();
  const canUndo = notes !== lastSavedNote;

  return (
    <FloatingNotesBox elevation={6}>
      <Header>
        <Typography variant="subtitle1" sx={{ fontSize: "medium" }}>
          Quick Notes
        </Typography>
        <Box>
          <Tooltip title="Undo to last saved note">
            <span>
              <IconButton
                size="small"
                onClick={handleUndoNote}
                disabled={!canUndo}
              >
                <UndoIcon sx={{ color: "white", opacity: canUndo ? 1 : 0.4 }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Clear note">
            <span>
              <IconButton
                size="small"
                onClick={handleResetNote}
                disabled={isNoteEmpty}
              >
                <RestartAltIcon
                  sx={{ color: "white", opacity: isNoteEmpty ? 0.4 : 1 }}
                />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Copy note to clipboard">
            <span>
              <IconButton
                size="small"
                onClick={handleCopyNote}
                disabled={isNoteEmpty}
              >
                <ContentCopyIcon
                  sx={{ color: "white", opacity: isNoteEmpty ? 0.4 : 1 }}
                />
              </IconButton>
            </span>
          </Tooltip>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
      </Header>

      <NoteAreaWrapper>
        <NoteField
          fullWidth
          multiline
          variant="outlined"
          value={notes}
          onChange={handleChange}
          onFocus={() => setIsSaved(false)}
          placeholder="Write your notes here..."
        />
        <EnhanceButton
          onClick={handleEnhanceButtonClick}
          disabled={isNoteEmpty || isEnhancing}
        >
          {isEnhancing ? (
            <CircularProgress size={24} thickness={4} />
          ) : (
            <AutoAwesomeOutlinedIcon color="primary" />
          )}
        </EnhanceButton>
      </NoteAreaWrapper>

      <Footer>
        <Button
          variant="contained"
          onClick={handleSaveNote}
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
    </FloatingNotesBox>
  );
});

export default NotesPanel;
