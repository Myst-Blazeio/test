// src/components/DiagonalButton.jsx

import React, { useState } from "react";
import { Button, Fade } from "@mui/material";
import styled from "@emotion/styled";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import FloatingAIChat from "../window/FloatingAIChat"; // ✅ Import the floating window

const StyledTopLeftButton = styled(Button)({
  position: "fixed",
  bottom: "120px",
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

const DiagonalButton = ({ show }) => {
  const [showChat, setShowChat] = useState(false);

  const handleClick = () => {
    setShowChat((prev) => !prev);
  };

  return (
    <>
      <Fade in={show} timeout={300}>
        <StyledTopLeftButton onClick={handleClick} variant="contained">
          <TipsAndUpdatesIcon fontSize="large" />
        </StyledTopLeftButton>
      </Fade>
      {showChat && <FloatingAIChat />}
    </>
  );
};

export default DiagonalButton;
