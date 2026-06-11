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
  const messagesEndRef = useRef(null);

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

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const userMsg = { sender: "user", text: trimmed };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post("/api/ai/chat", {
        message: trimmed,
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

  return (
    <div className="assistant-page">
      <div className="assistant-header card">
        <div>
          <p className="assistant-subtitle">Personal support, anytime.</p>
          <h2>Mind Assistant</h2>
          <p className="assistant-description">
            Chat with your guided mental wellness companion. Ask for breathing
            tips, mood support, or a quick motivation boost.
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
