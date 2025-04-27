// src/components/TopLeftButton.jsx

import React from "react";
import { Button, Fade } from "@mui/material";
import styled from "@emotion/styled";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates"; // 💡icon

const StyledTopLeftButton = styled(Button)({
  position: "fixed",
  bottom: "120px", // halfway to top
  right: "120px", // halfway to left
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

const DiagonalButton = ({ show, onClick }) => {
  return (
    <Fade in={show} timeout={300}>
      <StyledTopLeftButton onClick={onClick} variant="contained">
        <TipsAndUpdatesIcon fontSize="large" />
      </StyledTopLeftButton>
    </Fade>
  );
};

export default DiagonalButton;

//this is a working version of the DiagonalButton component. It includes a button that, when clicked, sends a message to the background script to fetch the current YouTube URL. The button is styled using Material-UI and Emotion, and it uses the TipsAndUpdates icon from Material-UI icons. The button appears with a fade-in effect when the `show` prop is true.
