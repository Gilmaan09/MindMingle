const express = require('express');
const router = express.Router();
const axios = require('axios');
const Mood = require('../models/Mood');
const { protect } = require('../middleware/auth');

const moodLabels = {
  1: 'Depressed',
  2: 'Stressed',
  3: 'Neutral',
  4: 'Happy',
  5: 'Excited',
};

const getDefaultSuggestions = (mood, note, activities) => {
  const moodLabel = moodLabels[mood] || 'Neutral';
  const base = `You're feeling ${moodLabel}.`;
  const activityText = activities?.length ? ` You mentioned recent activities: ${activities.join(', ')}.` : '';
  const noteText = note ? ` Your note: "${note}".` : '';

  if (mood <= 2) {
    return `${base}${activityText}${noteText} Try these gentle ideas:
- Take a short break and breathe deeply for a few minutes.
- Reach out to a friend, family member, or trusted person.
- Do something small that feels comforting, like listening to music or going for a walk.`;
  }

  if (mood === 3) {
    return `${base}${activityText}${noteText} Here are some balanced suggestions:
- Reflect on one positive thing that happened today.
- Keep up an activity that feels steady, like reading or stretching.
- Check in with your energy and rest when you need to.`;
  }

  return `${base}${activityText}${noteText} Keep building on this good energy:
- Celebrate a small win from today.
- Do something gentle that you enjoy, like a creative hobby or a favorite song.
- Stay mindful of your emotions and let yourself relax.`;
};

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

// @route POST /api/mood/suggestions - Get mood-based AI suggestions (public)
// This endpoint does not require authentication because it only uses the
// provided mood/note/activities to generate generic suggestions.
router.post('/suggestions', async (req, res) => {
  try {
    const { mood, note = '', activities = [] } = req.body;
    const moodLabel = moodLabels[mood] || 'Neutral';
    const activityText = activities.length ? activities.join(', ') : 'no activities';
    const prompt = `You are a supportive mental wellness coach. The user reports their mood is ${moodLabel} (score ${mood}). Note: ${note || 'No additional note provided.'} Recent activities: ${activityText}. Provide 3 practical, compassionate mood suggestions for this user, and keep the tone warm and encouraging.`;

    if (!process.env.OPENROUTER_API_KEY) {
      return res.json({ success: true, suggestions: getDefaultSuggestions(mood, note, activities) });
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a gentle mental wellness coach.' },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const suggestions = response.data.choices?.[0]?.message?.content || getDefaultSuggestions(mood, note, activities);
    res.json({ success: true, suggestions });
  } catch (error) {
    console.error('Mood suggestions error:', error.response?.data || error.message);
    res.json({ success: true, suggestions: getDefaultSuggestions(req.body.mood, req.body.note, req.body.activities) });
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
