import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const moodOptions = [
  { value: 1, emoji: '😢', label: 'Depressed' },
  { value: 2, emoji: '😔', label: 'Stressed' },
  { value: 3, emoji: '😐', label: 'Normal' },
  { value: 4, emoji: '😊', label: 'Happy' },
  { value: 5, emoji: '😄', label: 'Excited' },
];

const MoodCheckin = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  if (!selectedMood) return;

  setLoading(true);
  try {
    await axios.post('/api/mood', {
      mood: selectedMood,
      note: note
    });

    // 🔥 Mood-based navigation
    if (selectedMood === 1) {
      navigate('/exercises?mood=depressed');
    } 
    else if (selectedMood === 2) {
      navigate('/exercises?mood=stressed');
    } 
    else if (selectedMood === 3) {
      navigate('/exercises?mood=normal');
    } 
    else if (selectedMood === 4) {
      navigate('/exercises?mood=happy');
    } 
    else {
      navigate('/exercises?mood=excited');
    }

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <h2 style={{ marginBottom: '10px' }}>How are you feeling today? 🌿</h2>
        <p style={{ marginBottom: '20px', color: '#777' }}>
          Take a moment to check in with yourself.
        </p>

        <div style={moodContainerStyle}>
          {moodOptions.map(m => (
            <button
              key={m.value}
              style={{
                ...moodBtnStyle,
                backgroundColor: selectedMood === m.value ? '#d8f3dc' : '#f5f5f5'
              }}
              onClick={() => setSelectedMood(m.value)}
            >
              <div style={{ fontSize: '2rem' }}>{m.emoji}</div>
              <div>{m.label}</div>
            </button>
          ))}
        </div>

        {selectedMood && (
          <>
            <textarea
              placeholder="Add a note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={textareaStyle}
            />

            <button
              onClick={handleSubmit}
              style={submitBtnStyle}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const overlayStyle = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f4f6f8'
};

const popupStyle = {
  backgroundColor: 'white',
  padding: '40px',
  borderRadius: '15px',
  width: '500px',
  maxWidth: '90%',
  textAlign: 'center',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
};

const moodContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '20px'
};

const moodBtnStyle = {
  padding: '15px',
  borderRadius: '10px',
  border: 'none',
  cursor: 'pointer',
  width: '80px',
  textAlign: 'center'
};

const textareaStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  marginBottom: '15px'
};

const submitBtnStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#7c9f8a',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer'
};

export default MoodCheckin;