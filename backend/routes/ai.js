const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const Chat = require("../models/Chat");
const { buildUserContent, normalizeAssistantReply } = require("../utils/aiAttachments");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post("/chat", upload.array("files", 10), async (req, res) => {
  try {
    const message = req.body.message || "";
    const files = req.files || [];
    const sessionId = req.body.sessionId || "default-session";

    const payload = await buildUserContent({
      message,
      files: files.map((file) => ({
        originalname: file.originalname,
        mimetype: file.mimetype,
        buffer: file.buffer
      }))
    });

    const chatHistory = await Chat.find({ sessionId }).sort({ createdAt: 1 }).limit(20);

    const messages = [];

    chatHistory.forEach((chat) => {
      if (chat.message) {
        messages.push({ role: "user", content: chat.message });
      }
      if (chat.reply) {
        messages.push({ role: "assistant", content: chat.reply });
      }
    });

    messages.push({
      role: "user",
      content: Array.isArray(payload) ? payload : [{ type: "text", text: "Please help me with my current need." }]
    });

    console.log("Conversation history messages:", messages.length);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/free",
        messages,
        max_tokens: 512
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = normalizeAssistantReply(response.data?.choices?.[0]?.message?.content || "");

    // Save to database with session ID for history tracking
    await Chat.create({
      sessionId: sessionId,
      message: message || "Attachment-based request",
      reply: reply
    });

    res.json({ reply, sessionId });
  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "AI failed", details: error.message });
  }
});

// Clear conversation history for a session
router.post("/clear-session", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    await Chat.deleteMany({ sessionId });

    console.log("Session cleared:", sessionId);
    res.json({ success: true, message: "Conversation cleared" });
  } catch (error) {
    console.error("ERROR clearing session:", error.message);
    res.status(500).json({ error: "Failed to clear session" });
  }
});

module.exports = router;