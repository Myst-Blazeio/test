import React, { useState } from "react";
import {
  Box,
  Fab,
  Modal,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import PuzzleIcon from "@mui/icons-material/Extension";
import CloseIcon from "@mui/icons-material/Close";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import DownloadIcon from "@mui/icons-material/Download";
import ChatIcon from "@mui/icons-material/Chat";
import EditIcon from "@mui/icons-material/Edit";

const FloatingMenu = () => {
  const [open, setOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState("");
  const [notesTitle, setNotesTitle] = useState("My Notes");
  const [editingTitle, setEditingTitle] = useState(false);

  const toggleMenu = () => {
    if (open) {
      setActivePanel(null);
    }
    setOpen(!open);
  };

  const handlePanelToggle = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const handleSave = () => {
    setSavedNotes(notes);
  };

  const isSaved = notes === savedNotes;

  const buttons = [
    {
      icon: <StickyNote2Icon />,
      panel: "edit",
    },
    {
      icon: <DownloadIcon />,
      panel: "download",
    },
    {
      icon: <ChatIcon />,
      panel: "chat",
    },
  ];

  const renderPanel = (panelName, title, description) => (
    <Modal
      open={activePanel === panelName}
      onClose={() => setActivePanel(null)}
      disableAutoFocus
      hideBackdrop
    >
      <Paper
        sx={{
          position: "fixed",
          bottom: 100,
          right: 100,
          px: panelName === "edit" ? 1 : 2,
          py: panelName === "edit" ? 1 : 2,
          width: 300,
          borderRadius: 2,
          bgcolor: panelName === "edit" ? "navy" : "background.paper",
          color: panelName === "edit" ? "white" : "text.primary",
        }}
      >
        {panelName === "edit" ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            {editingTitle ? (
              <TextField
                variant="standard"
                value={notesTitle}
                onChange={(e) => setNotesTitle(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                autoFocus
                fullWidth
                sx={{ input: { color: "white" } }}
              />
            ) : (
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {notesTitle}
              </Typography>
            )}
            <IconButton
              onClick={() => setEditingTitle(true)}
              sx={{ color: "white", ml: 1 }}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            {title}
          </Typography>
        )}

        {panelName === "edit" ? (
          <>
            <TextField
              multiline
              rows={6}
              fullWidth
              placeholder="Type your notes here..."
              variant="outlined"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{
                mb: 1,
                bgcolor: "white",
                borderRadius: 1,
                "& .MuiInputBase-root": {
                  padding: "8px",
                },
              }}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{
                boxShadow: 3,
                bgcolor: isSaved ? "green" : "primary.main",
                "&:hover": {
                  bgcolor: isSaved ? "darkgreen" : "primary.dark",
                },
              }}
              onClick={handleSave}
            >
              {isSaved ? "Saved" : "Save"}
            </Button>
          </>
        ) : (
          <Typography variant="body2">{description}</Typography>
        )}
      </Paper>
    </Modal>
  );

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: 56,
            height: 56,
          }}
        >
          {buttons.map((btn, index) => {
            const distance = (index + 0.16) * 64;
            return (
              <Fab
                key={btn.panel}
                color="primary"
                size="large"
                aria-label={`${btn.panel} panel`}
                onClick={() => handlePanelToggle(btn.panel)}
                sx={{
                  position: "absolute",
                  bottom: open ? distance : 0,
                  right: 0,
                  opacity: open ? 1 : 0,
                  transform: open ? "scale(1)" : "scale(0)",
                  transition: "all 0.3s ease",
                }}
              >
                {btn.icon}
              </Fab>
            );
          })}
        </Box>

        <Fab color="primary" onClick={toggleMenu} size="large">
          {open ? <CloseIcon /> : <PuzzleIcon />}
        </Fab>
      </Box>

      {renderPanel("edit", "Notes Panel", "Write your notes.")}
      {renderPanel("download", "Download Panel", "Download content here.")}
      {renderPanel("chat", "Chatbot Panel", "Interact with chatbot here.")}
    </>
  );
};

export default FloatingMenu;
