const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const { protect } = require('../middleware/auth');

// @route POST /api/mood - Log mood
router.post('/', protect, async (req, res) => {
  try {
    const { mood, note, tags, activities } = req.body;

    const moodEntry = await Mood.create({
      user: req.user._id,
      mood,
      note,
      tags,
      activities,
      date: new Date()
    });

    res.status(201).json({ success: true, data: moodEntry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/mood - Get mood history
router.get('/', protect, async (req, res) => {
  try {
    const { limit = 30, startDate, endDate } = req.query;
    const query = { user: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const moods = await Mood.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    // Calculate stats
    const total = moods.length;
    const avgMood = total > 0 ? (moods.reduce((sum, m) => sum + m.mood, 0) / total).toFixed(1) : 0;
    const moodCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    moods.forEach(m => moodCounts[m.mood]++);

    res.json({
      success: true,
      data: moods,
      stats: { total, avgMood, moodCounts }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/mood/today - Get today's mood
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mood = await Mood.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow }
    }).sort({ date: -1 });

    res.json({ success: true, data: mood });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route DELETE /api/mood/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!mood) return res.status(404).json({ success: false, message: 'Mood entry not found' });
    res.json({ success: true, message: 'Mood entry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
