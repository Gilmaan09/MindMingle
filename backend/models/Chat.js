const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    default: "default-session",
    index: true
  },
  message: String,
  reply: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Chat", chatSchema);