import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const MentalAssistant = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.onstart = () => {
      console.log("Listening...");
    };

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      console.log("Voice:", speechText);
      setMessage(speechText);
    };

    recognition.onerror = (event) => {
      console.error("Error:", event.error);
    };

    recognition.start();
  };

  const speak = (text) =>{
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech)
  }
  const navigate = useNavigate();

  const mood = localStorage.getItem("mood"); // from your login

const handleSend = async () => {
  if (!message.trim()) return;

  const userMsg = { sender: "user", text: message };

  setChat(prev => [...prev, userMsg]);

  try {
    const res = await axios.post("/api/ai/chat", {
      message
    });

    const botMsg = { sender: "bot", text: res.data.reply };
    
speak(res.data.reply)
    setChat(prev => [...prev, botMsg]);

  } catch (err) {
    console.error(err);
  }

  setMessage("");
};

 return (
  <div style={{ padding: "20px" }}>
    <h2>💬 Mind Assistant</h2>

    {/* Chat box */}
    <div style={{
      height: "400px",
      overflowY: "auto",
      border: "1px solid #ccc",
      padding: "10px",
      marginBottom: "10px"
    }}>
      {chat.map((msg, index) => (
        <div
          key={index}
          style={{
            textAlign: msg.sender === "user" ? "right" : "left",
            margin: "10px 0"
          }}
        >
          <span style={{
            display: "inline-block",
            padding: "10px",
            borderRadius: "10px",
            background: msg.sender === "user" ? "#DCF8C6" : "#eee"
          }}>
            {msg.text}
          </span>
        </div>
      ))}
    </div>

    {/* Input */}
    {/* <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type your message..."
    />
    <button onClick={handleSend}>Send</button>
    <button onClick={startListening}>Speak</button> */}
    <div className="chat-input-modern">
  <input
    type="text"
    placeholder="Type your message..."
    value={message}
    onChange={(e) => setMessage(e.target.value)}
  />

  <button className="send-btn" onClick={handleSend}>
    ➤
  </button>

  <button className="speak-btn" onClick={startListening}>
    🎤
  </button>
</div>
  </div>
);
};

export default MentalAssistant;