import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const categoryIcons = {
  breathing: '🌬️',
  meditation: '🧘',
  'body-scan': '🫁',
  visualization: '🌅',
  journaling: '📝',
  movement: '🤸',
};

const difficultyColors = {
  beginner: 'badge-sage',
  intermediate: 'badge-gold',
  advanced: 'badge-coral',
};

const moodCategoryMap = {
  sad: 'journaling',
  happy: 'movement',
  anxious: 'breathing',
  stressed: 'meditation',
  tired: 'body-scan',
  calm: 'visualization',
};

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const location = useLocation();

  useEffect(() => {
    fetchExercises(filter);
  }, [filter]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mood = params.get('mood');

    if (mood && moodCategoryMap[mood]) {
      setFilter(moodCategoryMap[mood]);
    }
  }, [location.search]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || !selected?.instructions) return;

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % selected.instructions.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, selected]);

  const fetchExercises = async (category) => {
    setLoading(true);

    try {
      const res = await axios.post('/api/exercises/generate', {
        category: category === 'all' ? 'all' : category,
      });
      const data = res.data?.exercises || res.data?.data || res.data;

      if (Array.isArray(data)) {
        setExercises(data);
      } else {
        setExercises([]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load exercises');
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = Array.isArray(exercises)
    ? filter === 'all'
      ? exercises
      : exercises.filter((ex) => ex.category === filter)
    : [];

  const categories = [
    { value: 'all', label: 'All', emoji: '✨' },
    { value: 'breathing', label: 'Breathing', emoji: '🌬️' },
    { value: 'meditation', label: 'Meditation', emoji: '🧘' },
    { value: 'body-scan', label: 'Body Scan', emoji: '🫁' },
    { value: 'visualization', label: 'Visualize', emoji: '🌅' },
    { value: 'journaling', label: 'Journal', emoji: '📝' },
    { value: 'movement', label: 'Movement', emoji: '🤸' },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>Mindfulness Exercises</h2>
        <p>Exercises based on your selected mood 💛</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setFilter(c.value)}
            className="btn"
            style={{
              background: filter === c.value ? 'var(--sage)' : 'var(--white)',
              color: filter === c.value ? 'white' : 'var(--charcoal-soft)',
            }}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" />
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className="empty-state">
          <h3>No exercises found</h3>
          <p>Try selecting a different mood or category</p>
        </div>
      ) : (
        <div className="card-grid card-grid-3">
          {filteredExercises.map((ex) => (
            <div
              key={ex._id || ex.title}
              className="exercise-card"
              onClick={() => {
                setSelected(ex);
                setIsPlaying(true);
                setStepIndex(0);
                setTimeLeft(ex.duration * 60);
              }}
            >
              <div className={`exercise-card-header ${ex.category}`}>
                <div className="exercise-card-icon">{categoryIcons[ex.category]}</div>
                <div className="exercise-card-title">{ex.title}</div>
              </div>

              <div className="exercise-card-body">
                <div className="exercise-meta">
                  <span className="exercise-tag">⏱ {ex.duration} min</span>
                  <span className="exercise-tag">{ex.difficulty}</span>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--charcoal-soft)', lineHeight: 1.6 }}>
                  {ex.description}
                </p>

                <button className="btn btn-primary btn-sm" style={{ marginTop: '14px', width: '100%' }}>
                  Start Exercise →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              ✕
            </button>

            <h2>{selected.title}</h2>
            <p>{selected.description}</p>

            <div style={{ marginTop: '10px' }}>
              <span className={`badge ${difficultyColors[selected.difficulty]}`}>{selected.difficulty}</span>
              <span className="badge badge-lavender">⏱ {selected.duration} min</span>
            </div>

            {isPlaying && selected.instructions?.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <div className="person-animation" />

                <h3>Step {stepIndex + 1}</h3>
                <p style={{ fontSize: '1.1rem' }}>{selected.instructions[stepIndex].text}</p>
                <p>⏱ {timeLeft}s remaining</p>
              </div>
            )}

            {selected.benefits?.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4>Benefits</h4>
                {selected.benefits.map((b, i) => (
                  <span key={i} className="badge badge-sage">
                    ✓ {b}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercises;
