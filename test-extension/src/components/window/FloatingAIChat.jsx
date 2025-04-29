// src/components/FloatingAIWindow.jsx

import React from "react";
import styled from "@emotion/styled";

const FloatingBox = styled("div")({
  position: "fixed",
  bottom: "200px",
  right: "100px",
  width: "300px",
  height: "400px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  zIndex: "9998",
  padding: "16px",
  overflow: "auto",
});

const FloatingAIChat = () => {
  return (
    <FloatingBox>
      <h3>AI Assistant</h3>
      <p>Hello! Ask me anything related to your YouTube video.</p>
    </FloatingBox>
  );
};

export default FloatingAIChat;
