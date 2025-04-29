import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import styled from "@emotion/styled";
import LeftButton from "./LeftButton";
import TopButton from "./TopButton";
import DiagonalButton from "./DiagonalButton"; // NEW
// import RobotIcon from "@mui/icons-material/SmartToy";
import PuzzleIcon from "@mui/icons-material/Extension";
import CloseIcon from "@mui/icons-material/Close";

const StyledMainButton = styled(Button)({
  position: "fixed",
  bottom: "50px",
  right: "50px",
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

const FloatingButton = () => {
  const [showButtons, setShowButtons] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const [showTopLeftButton, setShowTopLeftButton] = useState(false); // NEW

  const handleMainButtonClick = () => {
    if (showButtons) {
      // Hide all side buttons
      setShowLeftButton(false);
      setShowTopButton(false);
      setShowTopLeftButton(false);
      setTimeout(() => setShowButtons(false), 300);
    } else {
      setShowButtons(true);
    }
  };

  // Control staggered appearance
  useEffect(() => {
    if (showButtons) {
      const leftTimer = setTimeout(() => {
        setShowLeftButton(true);
      }, 100);

      const topLeftTimer = setTimeout(() => {
        setShowTopLeftButton(true);
      }, 200); // Appears after left button, before top

      const topTimer = setTimeout(() => {
        setShowTopButton(true);
      }, 300);

      return () => {
        clearTimeout(leftTimer);
        clearTimeout(topLeftTimer);
        clearTimeout(topTimer);
      };
    }
  }, [showButtons]);

  return (
    <>
      {/* Main button */}
      <StyledMainButton onClick={handleMainButtonClick} variant="contained">
        {showButtons ? (
          <CloseIcon fontSize="large" />
        ) : (
          <PuzzleIcon fontSize="large" />
        )}
      </StyledMainButton>

      {/* Side buttons */}
      <LeftButton show={showLeftButton} />
      <DiagonalButton show={showTopLeftButton} />
      <TopButton show={showTopButton} />
    </>
  );
};

export default FloatingButton;
