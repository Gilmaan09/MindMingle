const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    minlength: 6,
    select: false
  },
  gender: {
  type: String,
  enum: ['Male', 'Female', 'Other'],
  required: true
},

dob: {
  type: Date,
  required: true
},
  googleId: { type: String },
  facebookId: { type: String },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    default: 'local'
  },
  avatar: { type: String, default: '' },
  bio: { type: String, maxlength: 200, default: '' },
  isAnonymous: { type: Boolean, default: false },
  anonymousName: { type: String, default: '' },
  reminders: [{
    time: String,
    frequency: { type: String, enum: ['daily', 'weekly', 'custom'], default: 'daily' },
    days: [String],
    isActive: { type: Boolean, default: true },
    message: { type: String, default: 'Time for your mindfulness practice! 🧘' }
  }],
  goals: [{
    title: String,
    target: Number,
    current: { type: Number, default: 0 },
    unit: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
