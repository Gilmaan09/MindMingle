const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');
const { protect } = require('../middleware/auth');

// @route GET /api/exercises - Get all exercises
router.get('/', protect, async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.$text = { $search: search };

    const exercises = await Exercise.find(query).sort({ isFeatured: -1, createdAt: -1 });
    res.json({ success: true, data: exercises });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/exercises/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json({ success: false, message: 'Exercise not found' });
    res.json({ success: true, data: exercise });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/exercises/seed - Seed exercises (dev only)
router.post('/seed', async (req, res) => {
  try {
    await Exercise.deleteMany({});
    const exercises = [
      {
        title: '4-7-8 Breathing',
        description: 'A powerful breathing technique that helps reduce anxiety and promotes relaxation.',
        category: 'breathing',
        duration: 5,
        difficulty: 'beginner',
        isFeatured: true,
        benefits: ['Reduces anxiety', 'Improves sleep', 'Lowers heart rate'],
        instructions: [
          { step: 1, text: 'Sit comfortably with your back straight.' },
          { step: 2, text: 'Exhale completely through your mouth.' },
          { step: 3, text: 'Close your mouth and inhale quietly through your nose for 4 seconds.' },
          { step: 4, text: 'Hold your breath for 7 seconds.' },
          { step: 5, text: 'Exhale completely through your mouth for 8 seconds.' },
          { step: 6, text: 'Repeat 3-4 times.' }
        ],
        tags: ['anxiety', 'sleep', 'relaxation']
      },
      {
        title: 'Body Scan Meditation',
        description: 'A mindfulness practice that promotes awareness of your physical sensations.',
        category: 'body-scan',
        duration: 15,
        difficulty: 'beginner',
        isFeatured: true,
        benefits: ['Reduces tension', 'Increases body awareness', 'Promotes relaxation'],
        instructions: [
          { step: 1, text: 'Lie down or sit comfortably in a quiet place.' },
          { step: 2, text: 'Close your eyes and take three deep breaths.' },
          { step: 3, text: 'Focus your attention on your feet. Notice any sensations.' },
          { step: 4, text: 'Slowly move your attention up through your legs, torso, arms, and head.' },
          { step: 5, text: 'If your mind wanders, gently bring it back.' }
        ],
        tags: ['relaxation', 'body-awareness', 'stress']
      },
      {
        title: 'Loving-Kindness Meditation',
        description: 'Cultivate compassion for yourself and others through this guided practice.',
        category: 'meditation',
        duration: 10,
        difficulty: 'beginner',
        isFeatured: true,
        benefits: ['Increases compassion', 'Reduces negative emotions', 'Improves relationships'],
        instructions: [
          { step: 1, text: 'Sit comfortably and close your eyes.' },
          { step: 2, text: 'Visualize yourself and repeat: "May I be happy, may I be healthy, may I be at peace."' },
          { step: 3, text: 'Extend this to someone you love.' },
          { step: 4, text: 'Extend to a neutral person, then a difficult person.' },
          { step: 5, text: 'Finally extend to all beings everywhere.' }
        ],
        tags: ['compassion', 'relationships', 'positivity']
      },
      {
        title: 'Gratitude Journaling',
        description: 'A reflective writing practice to shift focus towards positive aspects of life.',
        category: 'journaling',
        duration: 10,
        difficulty: 'beginner',
        benefits: ['Boosts mood', 'Increases optimism', 'Improves sleep quality'],
        instructions: [
          { step: 1, text: 'Find a quiet space with your journal.' },
          { step: 2, text: 'Write 3 things you are grateful for today.' },
          { step: 3, text: 'Reflect on why each thing matters to you.' },
          { step: 4, text: 'End with one kind thing you did for yourself today.' }
        ],
        tags: ['gratitude', 'positivity', 'reflection']
      },
      {
        title: 'Progressive Muscle Relaxation',
        description: 'Systematically tense and relax muscle groups to release physical tension.',
        category: 'movement',
        duration: 20,
        difficulty: 'intermediate',
        benefits: ['Reduces physical tension', 'Relieves stress', 'Improves sleep'],
        instructions: [
          { step: 1, text: 'Lie down in a comfortable position.' },
          { step: 2, text: 'Starting with your feet, tense the muscles tightly for 5 seconds.' },
          { step: 3, text: 'Release and relax for 30 seconds, noticing the contrast.' },
          { step: 4, text: 'Move up to your calves, thighs, abdomen, hands, arms, shoulders, face.' }
        ],
        tags: ['tension', 'sleep', 'physical']
      },
      {
        title: 'Visualization Journey',
        description: 'Take a mental journey to a peaceful place to reduce stress and anxiety.',
        category: 'visualization',
        duration: 12,
        difficulty: 'intermediate',
        benefits: ['Reduces anxiety', 'Boosts confidence', 'Promotes creativity'],
        instructions: [
          { step: 1, text: 'Close your eyes and breathe deeply for 2 minutes.' },
          { step: 2, text: 'Imagine a peaceful, safe place - a beach, forest, or mountain.' },
          { step: 3, text: 'Engage all senses: what do you see, hear, smell, feel?' },
          { step: 4, text: 'Spend 10 minutes exploring this place.' },
          { step: 5, text: 'Slowly return your awareness to the room.' }
        ],
        tags: ['visualization', 'anxiety', 'creativity']
      }
    ];

    await Exercise.insertMany(exercises);
    res.json({ success: true, message: `${exercises.length} exercises seeded` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
