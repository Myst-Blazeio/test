// DiagonalButton.util.jsx
import axios from "axios";
import { baseAPIurl } from "../config";

export const askTutorAndGetAnswer = async (question) => {
  try {
    // Step 1: POST the user question
    await axios.post(`${baseAPIurl}api/tutor/ask`, { question });

    // Step 2: Immediately GET the AI-generated answer
    const response = await axios.get(`${baseAPIurl}api/tutor/answer`);
    console.log(response);
    // Return the answer text
    return response.data || "No answer received.";
  } catch (error) {
    console.error("Error in tutor communication:", error);
    throw new Error("Failed to communicate with AI Tutor.");
  }
};
