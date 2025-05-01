import { useState } from "react";
import axios from "axios";
import { baseAPIurl } from "../config";

// Custom hook to manage notes panel state and actions
export const useNotesPanel = () => {
  const [notes, setNotes] = useState(""); // State for storing notes
  const [lastSavedNote, setLastSavedNote] = useState(""); // Track the last saved note
  const [isSaved, setIsSaved] = useState(true); // Flag to indicate if the note is saved
  const [isEnhancing, setIsEnhancing] = useState(false); // Flag to indicate if note enhancement is in progress

  // Function to fetch notes from the backend
  const fetchNotesFromBackend = async () => {
    try {
      const response = await axios.get(`${baseAPIurl}api/notes/result`);
      if (response.status === 200 && response.data) {
        setNotes(response.data);
        localStorage.setItem("savedNotes", response.data); // Cache locally
        return response.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error("[ERROR] GET /api/notes/result:", error);
      return null;
    }
  };

  // Function to enhance notes by sending them to the backend
  const enhanceNote = async (noteText) => {
    if (!noteText.trim()) {
      return null;
    }

    try {
      const response = await axios.post(`${baseAPIurl}api/notes/enhance`, {
        notes: noteText,
      });

      if (response.status === 200) {
        const enhanced = await fetchNotesFromBackend(); // Fetch the result
        return enhanced;
      } else {
        return null;
      }
    } catch (error) {
      console.error("[ERROR] POST /api/notes/enhance:", error);
      return null;
    }
  };

  // Function to save notes to the backend
  const handleSaveNote = async () => {
    if (notes.trim() === lastSavedNote.trim()) return;

    try {
      localStorage.setItem("userNote", notes);
      setIsSaved(true);
      setLastSavedNote(notes);

      const response = await axios.post(`${baseAPIurl}api/notes/current`, {
        notes,
      });

      if (response.status === 200) {
      } else {
        const error = await response.text();
        console.error(`[ERROR] POST /api/notes/current: ${error}`);
      }
    } catch (err) {
      console.error("[ERROR] POST /api/notes/current:", err);
    }
  };

  // Function to reset notes (clear note content)
  const handleResetNote = async () => {
    setNotes("");
    setIsSaved(false);

    try {
      localStorage.setItem("userNote", "");
      await axios.post(`${baseAPIurl}api/notes/current`, {
        notes: "",
      });
    } catch (err) {
      console.error("[ERROR] POST /api/notes/current:", err);
    }
  };

  // Function to undo to the last saved note
  const handleUndoNote = async () => {
    setNotes(lastSavedNote);
    setIsSaved(true);

    try {
      localStorage.setItem("userNote", lastSavedNote);
      await axios.post(`${baseAPIurl}api/notes/current`, {
        notes: lastSavedNote,
      });
    } catch (err) {
      console.error("[ERROR] POST /api/notes/current (undo):", err);
    }
  };

  // Function to copy notes to clipboard
  const handleCopyNote = async () => {
    try {
      await navigator.clipboard.writeText(notes);
    } catch (err) {
      console.error("[ERROR] Copying note to clipboard:", err);
    }
  };

  return {
    notes,
    setNotes,
    lastSavedNote,
    setLastSavedNote,
    isSaved,
    setIsSaved,
    isEnhancing,
    setIsEnhancing,
    handleSaveNote,
    handleResetNote,
    handleUndoNote,
    handleCopyNote,
    enhanceNote, // Make the enhanceNote function available
  };
};
