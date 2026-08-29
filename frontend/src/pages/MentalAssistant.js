import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const quickReplies = [
  "I am feeling stressed",
  "I need some motivation",
  "I want a breathing exercise",
  "Help me relax"
];

const MentalAssistant = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Generate a unique session ID on component mount
  useEffect(() => {
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    console.log("Chat session started:", newSessionId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("Listening...");
    };

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setMessage(speechText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setSelectedFiles((prev) => [...prev, ...files]);
    event.target.value = "";
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed && !selectedFiles.length) return;

    const userMsg = {
      sender: "user",
      text: trimmed || `Shared ${selectedFiles.length} attachment${selectedFiles.length > 1 ? "s" : ""}`,
      files: selectedFiles.map((file) => file.name)
    };

    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setSelectedFiles([]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", trimmed);
      formData.append("sessionId", sessionId);
      selectedFiles.forEach((file) => formData.append("files", file));

      console.log("Sending message with sessionId:", sessionId);

      const res = await axios.post("/api/ai/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const botMsg = { sender: "bot", text: res.data.reply };
      setChat((prev) => [...prev, botMsg]);
      speak(res.data.reply);
    } catch (err) {
      console.error(err);
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I couldn't connect. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (text) => {
    setMessage(text);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  const startNewChat = async () => {
    try {
      // Clear old session from database
      if (sessionId) {
        await axios.post("/api/ai/clear-session", { sessionId });
      }

      // Generate new session ID
      const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      setChat([]);
      setMessage("");
      setSelectedFiles([]);
      
      console.log("New chat session started:", newSessionId);
    } catch (error) {
      console.error("Error starting new chat:", error);
    }
  };

  return (
    <div className="assistant-page">
      <div className="assistant-header card">
        <div>
          <p className="assistant-subtitle">Personal support, anytime.</p>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <h2>Mind Assistant</h2>
            <button
              type="button"
              onClick={startNewChat}
              style={{
                padding: "8px 16px",
                background: "linear-gradient(135deg, #5a7a6a, #7c9f8a)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "500",
                whiteSpace: "nowrap"
              }}
            >
              ✨ New Chat
            </button>
          </div>
          <p className="assistant-description">
            Chat with your guided mental wellness companion. Ask for breathing tips,
            mood support, a quick motivation boost, or share a photo or document for guidance.
          </p>
        </div>
        <div className="assistant-hero">
          <span>💚</span>
          <p>You're not alone — I'm here to listen.</p>
        </div>
      </div>

      <div className="assistant-card card">
        <div className="assistant-chat-shell">
          <div className="assistant-chat-box">
            {chat.length === 0 && (
              <div className="assistant-welcome">
                <p>Start the conversation and the assistant will respond with calm, friendly guidance.</p>
              </div>
            )}

            {chat.map((msg, index) => (
              <div
                key={index}
                className={`assistant-message ${msg.sender === "user" ? "user" : "bot"}`}
              >
                <div className="assistant-message-bubble">
                  <span>{msg.text}</span>
                  {msg.files && msg.files.length > 0 && (
                    <small className="assistant-attachment-list">
                      {msg.files.join(", ")}
                    </small>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="assistant-quick-replies">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                className="quick-reply"
                onClick={() => handleQuickReply(reply)}
              >
                {reply}
              </button>
            ))}
          </div>

          {selectedFiles.length > 0 && (
            <div className="assistant-file-list">
              {selectedFiles.map((file, index) => (
                <div key={`${file.name}-${index}`} className="assistant-file-chip">
                  <span>{file.name}</span>
                  <button type="button" onClick={() => removeFile(index)}>×</button>
                </div>
              ))}
            </div>
          )}

          <div className="chat-input-modern">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Message input"
            />
            <button
              type="button"
              className="camera-btn"
              onClick={openCamera}
              title="Take a photo"
            >
              📷
            </button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={handleFileSelection}
            />
            <button
              type="button"
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Upload document or photo"
            >
              📎
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
              multiple
              hidden
              onChange={handleFileSelection}
            />
            <button
              type="button"
              className="send-btn"
              onClick={handleSend}
              disabled={isLoading}
            >
              {isLoading ? "..." : "➤"}
            </button>
            <button
              type="button"
              className="speak-btn"
              onClick={startListening}
            >
              🎤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalAssistant;
