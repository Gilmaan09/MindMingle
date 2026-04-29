require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


// dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/mood', require('./routes/mood'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/community', require('./routes/community'));
app.use('/api/reminders', require('./routes/reminders'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Mindmingle API running' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
