const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['breathing', 'meditation', 'body-scan', 'visualization', 'journaling', 'movement'],
    required: true
  },
  duration: { type: Number, required: true }, // in minutes
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  instructions: [{ step: Number, text: String }],
  benefits: [String],
  tags: [String],
  imageUrl: String,
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Exercise', exerciseSchema);
