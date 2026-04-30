const express = require("express");
const router = express.Router();
const axios = require("axios");
const Chat = require("../models/Chat")
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("Message received:", message); // debug

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 
          "Content-Type": "application/json"
        }
      }
    );
    const reply = response.data.choices[0].message.content;

    await Chat.create({
        message,
        reply
    })

    res.json({
      reply
    });

  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message); 
    res.status(500).json({ error: "AI failed" });
  }
});

module.exports = router;