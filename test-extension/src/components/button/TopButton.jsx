import React, { useState, useEffect } from "react";
import { Button, Fade, CircularProgress, Tooltip } from "@mui/material";
import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // ✅ Added
import {
  handleFetchUrl,
  initSnackbarState,
  SnackbarComponent,
} from "../../util/TopButton.util";

const StyledTopButton = styled(Button)(({ theme }) => ({
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
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&.Mui-disabled": {
    backgroundColor: "#1976d2",
    color: "white",
    opacity: 0.7,
  },
}));

const TopButton = ({ show }) => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // ✅ Added
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Initialize the Snackbar state from utility
  useEffect(() => {
    initSnackbarState(setSnackbar);
  }, []);

  // Custom handleFetchUrl wrapper to handle success state
  const customHandleFetchUrl = async () => {
    setLoading(true);
    await handleFetchUrl(setLoading);

    // After loading ends (successful download), show success icon briefly
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 1000); // 1 second success icon
  };

  return (
    <>
      <Fade in={show} timeout={300}>
        <Tooltip title={loading ? "Summarizing..." : "Summarize Video"}>
          <StyledTopButton
            onClick={customHandleFetchUrl}
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} style={{ color: "white" }} />
            ) : showSuccess ? (
              <CheckCircleIcon fontSize="large" style={{ color: "white" }} />
            ) : (
              <SearchIcon fontSize="large" />
            )}
          </StyledTopButton>
        </Tooltip>
      </Fade>

      {/* Render the Snackbar component */}
      <SnackbarComponent snackbar={snackbar} setSnackbar={setSnackbar} />
    </>
  );
};

export default TopButton;
