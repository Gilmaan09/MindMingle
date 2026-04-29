const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route GET /api/reminders - Get user reminders
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('reminders');
    res.json({ success: true, data: user.reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/reminders - Add reminder
router.post('/', protect, async (req, res) => {
  try {
    const { time, frequency, days, message } = req.body;

    const user = await User.findById(req.user._id);
    user.reminders.push({ time, frequency, days, message, isActive:true });
    await user.save();

    res.status(201).json({ success: true, data: user.reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/reminders/:id - Update reminder
router.put('/:id', protect, async (req, res) => {
  try {
    const { time, frequency, days, message, isActive } = req.body;

    const user = await User.findById(req.user._id);
    const reminder = user.reminders.id(req.params.id);
    if (!reminder) return res.status(404).json({ success: false, message: 'Reminder not found' });

    if (time !== undefined) reminder.time = time;
    if (frequency !== undefined) reminder.frequency = frequency;
    if (days !== undefined) reminder.days = days;
    if (message !== undefined) reminder.message = message;
    if (isActive !== undefined) reminder.isActive = isActive;

    await user.save();
    res.json({ success: true, data: user.reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route DELETE /api/reminders/:id - Delete reminder
router.delete('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.reminders = user.reminders.filter(r => r._id.toString() !== req.params.id);
    await user.save();
    res.json({ success: true, data: user.reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
