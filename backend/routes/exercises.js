const express = require('express');
const axios = require('axios');
const router = express.Router();
const Exercise = require('../models/Exercise');
const { protect } = require('../middleware/auth');

const categoryLabels = {
  breathing: 'breathing',
  meditation: 'meditation',
  'body-scan': 'body-scan',
  visualization: 'visualization',
  journaling: 'journaling',
  movement: 'movement'
};

const parseJsonExercises = (raw) => {
  try {
    return JSON.parse(raw);
  } catch (err) {
    const match = raw.match(/(\[.*\])/s);
    if (match) {
      return JSON.parse(match[1]);
    }
    throw err;
  }
};

const fallbackExercises = (category) => {
  const all = [
    {
      title: 'Guided Breathing Reset',
      description: 'Use gentle breaths to anchor your body and calm your mind.',
      category: 'breathing',
      duration: 5,
      difficulty: 'beginner',
      benefits: ['Calms the nervous system', 'Reduces stress', 'Improves focus'],
      instructions: [
        { step: 1, text: 'Sit comfortably and close your eyes.' },
        { step: 2, text: 'Inhale slowly for 4 seconds.' },
        { step: 3, text: 'Hold your breath for 4 seconds.' },
        { step: 4, text: 'Exhale fully for 6 seconds.' },
        { step: 5, text: 'Repeat this cycle 5 times.' }
      ],
      tags: ['breathing', 'calm', 'focus']
    },
    {
      title: 'Heartfelt Gratitude Journal',
      description: 'Reflect on three things that brought you warmth today.',
      category: 'journaling',
      duration: 8,
      difficulty: 'beginner',
      benefits: ['Boosts positivity', 'Reduces stress', 'Improves self-awareness'],
      instructions: [
        { step: 1, text: 'Find a quiet space and open your journal.' },
        { step: 2, text: 'Write three things you are grateful for.' },
        { step: 3, text: 'Describe why each item was meaningful.' },
        { step: 4, text: 'Close with a kind intention for yourself.' }
      ],
      tags: ['gratitude', 'reflection', 'self-care']
    },
    {
      title: 'Calming Body Scan',
      description: 'Gently notice sensations through your body to release tension.',
      category: 'body-scan',
      duration: 12,
      difficulty: 'beginner',
      benefits: ['Lowers tension', 'Improves awareness', 'Eases stress'],
      instructions: [
        { step: 1, text: 'Lie down or sit comfortably.' },
        { step: 2, text: 'Focus on your feet and notice any sensations.' },
        { step: 3, text: 'Move attention slowly up through your legs and torso.' },
        { step: 4, text: 'Continue to your arms, shoulders, neck and head.' }
      ],
      tags: ['awareness', 'relaxation', 'tension']
    },
    {
      title: 'Mindful Movement Flow',
      description: 'Move gently with intention to refresh your energy and mood.',
      category: 'movement',
      duration: 10,
      difficulty: 'intermediate',
      benefits: ['Boosts energy', 'Relieves restlessness', 'Improves mood'],
      instructions: [
        { step: 1, text: 'Stand tall with feet hip-width apart.' },
        { step: 2, text: 'Inhale and raise your arms overhead.' },
        { step: 3, text: 'Exhale as you fold forward slowly.' },
        { step: 4, text: 'Repeat gentle stretches side to side for 8 breaths.' }
      ],
      tags: ['movement', 'energy', 'mood']
    },
    {
      title: 'Quiet Visualization Journey',
      description: 'Create a calm mental scene that helps you relax deeply.',
      category: 'visualization',
      duration: 10,
      difficulty: 'intermediate',
      benefits: ['Reduces anxiety', 'Improves focus', 'Enhances creativity'],
      instructions: [
        { step: 1, text: 'Sit comfortably and close your eyes.' },
        { step: 2, text: 'Imagine a peaceful place in vivid detail.' },
        { step: 3, text: 'Notice how it looks, sounds, and feels.' },
        { step: 4, text: 'Stay here for 8 slow breaths.' }
      ],
      tags: ['calm', 'focus', 'creativity']
    }
  ];

  if (!category || category === 'all') return all;
  return all.filter((exercise) => exercise.category === category) || all;
};

const buildPrompt = (category) => {
  const categories = category === 'all' ? 'a mix of breathing, meditation, body-scan, visualization, journaling, and movement' : `exercises in the ${category} category`;

  return `You are a supportive wellness coach generating practical, beginner-friendly mental wellness exercises. Create 4 exercises using ${categories}. For each exercise, return valid JSON only as an array of objects with exactly these fields: title, description, category, duration, difficulty, benefits, instructions, tags. The category must be one of breathing, meditation, body-scan, visualization, journaling, movement. Duration should be a number in minutes. Difficulty should be beginner, intermediate, or advanced. Benefits should be an array of short positive outcomes. Instructions should be an array of steps with {step: number, text: string}. Tags should be short keywords. Use warm, encouraging language in the description.`;
};

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

// @route POST /api/exercises/generate - Generate AI-based exercises
router.post('/generate', async (req, res) => {
  try {
    const { category = 'all' } = req.body;
    const useAI = Boolean(process.env.OPENROUTER_API_KEY);
    let exercises = [];

    if (useAI) {
      const prompt = buildPrompt(category);
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

      const raw = response.data?.choices?.[0]?.message?.content || '';
      exercises = parseJsonExercises(raw);
    }

    if (!Array.isArray(exercises) || exercises.length === 0) {
      exercises = fallbackExercises(category);
    }

    res.json({ success: true, exercises });
  } catch (error) {
    console.error('Exercise generation failed:', error.response?.data || error.message);
    const fallback = fallbackExercises(req.body?.category || 'all');
    res.json({ success: true, exercises: fallback });
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

module.exports = router;
