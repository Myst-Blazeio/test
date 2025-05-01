import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Tooltip,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import { askTutorAndGetAnswer } from "../../util/DiagonalButton.util"; // Adjust path if needed

// Styled Components
const FloatingBox = styled(Paper)({
  position: "fixed",
  bottom: "100px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "420px",
  background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
  borderRadius: "16px",
  boxShadow: "0 8px 30px rgba(0, 123, 255, 0.2)",
  overflow: "hidden",
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
});

const Header = styled(Box)({
  background: "#0d47a1",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px",
});

const HeaderButtons = styled(Box)({
  display: "flex",
  gap: "8px",
});

const MessageContainer = styled(Box)({
  flex: 1,
  overflowY: "auto",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  maxHeight: "280px",
});

const AnswerBox = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  gap: "8px",
  background: "#ffffff",
  borderRadius: "12px",
  padding: "10px 14px",
  color: "#0d47a1",
  maxWidth: "90%",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  overflowWrap: "anywhere",
});

const QuestionBubble = styled(Box)({
  alignSelf: "flex-end",
  background: "linear-gradient(to right, #42a5f5, #1e88e5)",
  color: "white",
  padding: "10px 14px",
  borderRadius: "12px",
  maxWidth: "80%",
  whiteSpace: "pre-wrap",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  overflowWrap: "anywhere",
});

const InputSection = styled(Box)({
  display: "flex",
  padding: "12px 16px",
  borderTop: "1px solid #ccc",
  alignItems: "flex-end",
  gap: "8px",
});

const InputField = styled(TextField)({
  background: "white",
  borderRadius: "8px",
  maxHeight: "100px",
  overflowY: "auto",
  flexGrow: 1,
  "& .MuiInputBase-root": {
    fontSize: "medium", // Input text size
  },
  "& input::placeholder, & textarea::placeholder": {
    fontSize: "medium",
    color: "gray", // <-- Set placeholder color to gray
    opacity: 1,
  },
});

const FloatingAIChat = () => {
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const savedQ = localStorage.getItem("lastQuestion");
    const savedA = localStorage.getItem("lastAnswer");
    if (savedQ && savedA) {
      setQuestion(savedQ);
      setAnswer(savedA);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const currentQuestion = input;
    setInput("");
    setQuestion(currentQuestion);
    setAnswer("...");

    try {
      const generatedAnswer = await askTutorAndGetAnswer(currentQuestion);
      setAnswer(generatedAnswer);
      localStorage.setItem("lastQuestion", currentQuestion);
      localStorage.setItem("lastAnswer", generatedAnswer);
    } catch (error) {
      setAnswer("There was an error getting the answer.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
  };

  const handleReset = () => {
    setQuestion(null);
    setAnswer(null);
    localStorage.removeItem("lastQuestion");
    localStorage.removeItem("lastAnswer");
  };

  if (!visible) return null;

  return (
    <FloatingBox elevation={6}>
      <Header>
        <Typography variant="subtitle1" sx={{ fontSize: "medium" }}>
          AI Tutor
        </Typography>
        <HeaderButtons>
          <Tooltip title="Reset Chat">
            <IconButton onClick={handleReset} size="small">
              <RefreshIcon sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton onClick={() => setVisible(false)} size="small">
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </HeaderButtons>
      </Header>

      <MessageContainer>
        {question && (
          <QuestionBubble sx={{ fontSize: "medium" }}>
            {question}
          </QuestionBubble>
        )}
        {answer && (
          <AnswerBox>
            <Tooltip title="Copy Answer">
              <IconButton
                size="small"
                onClick={handleCopy}
                sx={{
                  backgroundColor: "#e3f2fd",
                  padding: "4px",
                  height: "28px",
                  width: "28px",
                }}
              >
                <ContentCopyIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-wrap", fontSize: "medium" }}
            >
              {answer}
            </Typography>
          </AnswerBox>
        )}
      </MessageContainer>

      <InputSection>
        <InputField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type your question here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <IconButton
          onClick={handleSend}
          sx={{
            backgroundColor: "#0d47a1",
            color: "white",
            "&:hover": { backgroundColor: "#1565c0" },
            borderRadius: "50%",
            width: "48px",
            height: "48px",
          }}
        >
          <SendIcon sx={{ fontSize: "28px" }} />
        </IconButton>
      </InputSection>
    </FloatingBox>
  );
};

export default FloatingAIChat;
