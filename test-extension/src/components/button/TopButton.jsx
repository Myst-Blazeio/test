import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Tooltip, Zoom, Fade } from "@mui/material";
import styled from "@emotion/styled";
import SaveAltRoundedIcon from "@mui/icons-material/SaveAltRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  handleFetchUrl,
  initSnackbarState,
  SnackbarComponent,
} from "../../util/TopButton.util";

// Styled Floating Button
const StyledTopButton = styled(Button)({
  position: "fixed",
  bottom: "120px",
  right: "50px",
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  backgroundColor: "#1976d2",
  color: "white",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  fontSize: "24px",
  cursor: "pointer",
  zIndex: 10000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
  "&.Mui-disabled": {
    backgroundColor: "#1976d2",
    color: "white",
    opacity: 0.7,
  },
});

// Styled Tooltip using modern API
const StyledTooltip = styled((props) => (
  <Tooltip
    {...props}
    arrow
    placement="top"
    slots={{ transition: Zoom }}
    slotProps={{
      transition: { timeout: 300 },
      popper: {
        modifiers: [
          {
            name: "zIndex",
            enabled: true,
            phase: "write",
            fn: ({ state }) => {
              state.elements.popper.style.zIndex = "12000";
            },
          },
        ],
      },
    }}
  />
))(() => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "#000000",
    color: "#2196f3",
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: "6px",
    padding: "10px 15px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  },
}));

const TopButton = ({ show }) => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    initSnackbarState(setSnackbar);
  }, []);

  const customHandleFetchUrl = async () => {
    setLoading(true);
    await handleFetchUrl(setLoading);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1000);
  };

  return (
    <>
      <Fade in={show} timeout={300}>
        <StyledTooltip title={loading ? "Summarizing..." : "Summarize Video"}>
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
              <SaveAltRoundedIcon fontSize="large" />
            )}
          </StyledTopButton>
        </StyledTooltip>
      </Fade>

      <SnackbarComponent snackbar={snackbar} setSnackbar={setSnackbar} />
    </>
  );
};

export default TopButton;
