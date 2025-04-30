import React, { useState, useRef } from "react";
import { Button, Fade, Tooltip } from "@mui/material";
import styled from "@emotion/styled";
import EditNoteIcon from "@mui/icons-material/EditNote";
import NotesPanel from "../window/NotesPanel";

const StyledLeftButton = styled(Button)({
  position: "fixed",
  bottom: "50px",
  right: "120px",
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  backgroundColor: "#1976d2",
  color: "white",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  fontSize: "24px",
  cursor: "pointer",
  zIndex: "9999",
});

const LeftButton = ({ show }) => {
  const [showNotes, setShowNotes] = useState(false);
  const notesRef = useRef();

  const handleClick = async () => {
    if (showNotes && notesRef.current) {
      await notesRef.current.saveBeforeClose();
    }
    setShowNotes((prev) => !prev);
  };

  return (
    <>
      <Fade in={show} timeout={300}>
        <Tooltip title="Quick Notes" placement="left">
          <StyledLeftButton onClick={handleClick} variant="contained">
            <EditNoteIcon fontSize="large" />
          </StyledLeftButton>
        </Tooltip>
      </Fade>
      {showNotes && (
        <NotesPanel ref={notesRef} onClose={() => setShowNotes(false)} />
      )}
    </>
  );
};

export default LeftButton;
