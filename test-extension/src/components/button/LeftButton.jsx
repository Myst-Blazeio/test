import React from "react";
import { Button, Fade } from "@mui/material";
import styled from "@emotion/styled";
import EditNoteIcon from "@mui/icons-material/EditNote"; // 📝 icon

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

const LeftButton = ({ show, onClick }) => {
  return (
    <Fade in={show} timeout={300}>
      <StyledLeftButton onClick={onClick} variant="contained">
        <EditNoteIcon fontSize="large" />
      </StyledLeftButton>
    </Fade>
  );
};

export default LeftButton;

//this is a working version of the LeftButton component. It includes a button that, when clicked, sends a message to the background script to fetch the current YouTube URL. The button is styled using Material-UI and Emotion, and it uses the EditNote icon from Material-UI icons. The button appears with a fade-in effect when the `show` prop is true.
