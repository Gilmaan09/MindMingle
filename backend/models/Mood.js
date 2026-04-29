const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: Number,
    required: true,
    min: 1,
    max: 5 // 1=Depressed, 2=Stressed, 3=Normal, 4=Happy, 5=Excited
  },
  moodLabel: {
    type: String,
    enum: ['Depressed', 'Stressed', 'Normal', 'Happy', 'Excited']
  },
  emoji: { type: String },
  note: { type: String, maxlength: 500 },
  tags: [{ type: String }],
  activities: [{ type: String }],
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// Auto-set label based on mood score
moodSchema.pre('save', function(next) {
  const labels = ['', 'Depressed', 'Stressed', 'Normal', 'Happy', 'Excited'];
  const emojis = ['', '😢', '😔', '😐', '😊', '😄'];
  this.moodLabel = labels[this.mood];
  this.emoji = emojis[this.mood];
  next();
});

module.exports = mongoose.model('Mood', moodSchema);
