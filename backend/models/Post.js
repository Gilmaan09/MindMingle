const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAnonymous: { type: Boolean, default: true },
  displayName: { type: String }, // anonymous name or real name
  content: { type: String, required: true, maxlength: 1000 },
  tags: [String],
  sharedExperiences: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    displayName: String,
    isAnonymous: { type: Boolean, default: true },
    content: { type: String, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
  }],
  reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isHidden: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
