import React from "react";
import { Button, Fade } from "@mui/material";
import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search"; // 🔍 icon

const StyledTopButton = styled(Button)({
  position: "fixed",
  bottom: "120px",
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

const handleFetchUrl = () => {
  chrome.runtime.sendMessage({ type: "FETCH_YOUTUBE_URL" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Message failed:", chrome.runtime.lastError);
      alert("⚠️ Failed to fetch URL.");
      return;
    }

    if (response && response.url) {
      alert(`🎥 Current YouTube URL:\n${response.url}`);
    } else {
      alert("❌ No YouTube video detected on active tab.");
    }
  });
};

const TopButton = ({ show }) => {
  return (
    <Fade in={show} timeout={300}>
      <StyledTopButton
        onClick={() => {
          handleFetchUrl();
        }}
        variant="contained"
      >
        <SearchIcon fontSize="large" />
      </StyledTopButton>
    </Fade>
  );
};

export default TopButton;

//This is a working version of the TopButton component. It includes a button that, when clicked, sends a message to the background script to fetch the current YouTube URL. The button is styled using Material-UI and Emotion, and it uses the Search icon from Material-UI icons. The button appears with a fade-in effect when the `show` prop is true.
