// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const moodOptions = [
//   { value: 1, emoji: '😢', label: 'Depressed' },
//   { value: 2, emoji: '😔', label: 'Stressed' },
//   { value: 3, emoji: '😐', label: 'Normal' },
//   { value: 4, emoji: '😊', label: 'Happy' },
//   { value: 5, emoji: '😄', label: 'Excited' },
// ];

// const tips = [
//   'Start with just 5 minutes of breathing today. Every breath counts. 🌬️',
//   'Your feelings are valid. Take a moment to check in with yourself. 💚',
//   'Small steps lead to big changes. Be proud of every effort. 🌱',
//   'Remember: you deserve care and compassion — from yourself too. 🤗',
//   'Mindfulness isn\'t about perfection. It\'s about presence. 🧘',
// ];

// const Dashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [stats, setStats] = useState({ total: 0, avgMood: 0, streak: 0 });
//   const [recentMoods, setRecentMoods] = useState([]);
//   const [todayMood, setTodayMood] = useState(null);
//   const [selectedMood, setSelectedMood] = useState(null);
//   const [moodNote, setMoodNote] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const tip = tips[new Date().getDay() % tips.length];

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [moodRes, todayRes] = await Promise.all([
//         axios.get('/api/mood?limit=7'),
//         axios.get('/api/mood/today')
//       ]);
//       setStats(moodRes.data.stats);
//       setRecentMoods(moodRes.data.data);
//       setTodayMood(todayRes.data.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logMood = async () => {
//     if (!selectedMood) return;
//     setSubmitting(true);
//     try {
//       await axios.post('/api/mood', { mood: selectedMood, note: moodNote });
//       await fetchData();
//       setSelectedMood(null);
//       setMoodNote('');
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good morning';
//     if (hour < 17) return 'Good afternoon';
//     return 'Good evening';
//   };

//   const getMoodColor = (score) => {
//     const colors = { 1: '#e88a7a', 2: '#e8c4b8', 3: '#c9a96e', 4: '#a8c5b5', 5: '#7c9f8a' };
//     return colors[score] || '#ccc';
//   };

//   if (loading) return (
//     <div className="loading-spinner">
//       <div className="spinner" />
//     </div>
//   );

//   return (
//     <div>
//       {/* Header */}
//       <div className="page-header">
//         <h2>{getGreeting()}, {user?.name?.split(' ')[0]} 🌿</h2>
//         <p>How are you feeling today? Take a moment to check in.</p>
//       </div>

//       {/* Daily Tip */}
//       <div className="tip-banner">
//         <div>
//           <h3>Daily Intention</h3>
//           <p>{tip}</p>
//         </div>
//         <button
//           className="btn"
//           style={{ background: 'rgba(255,255,255,0.2)', color: 'white', whiteSpace: 'nowrap' }}
//           onClick={() => navigate('/exercises')}
//         >
//           Start Exercise ✨
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="stats-bar">
//         <div className="stat-card">
//           <div className="stat-number">{stats.avgMood || '—'}</div>
//           <div className="stat-label">Avg. Mood Score</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-number">{stats.total}</div>
//           <div className="stat-label">Total Check-ins</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-number">{recentMoods.length}</div>
//           <div className="stat-label">This Week</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-number">
//             {recentMoods[0] ? moodOptions.find(m => m.value === recentMoods[0].mood)?.emoji : '—'}
//           </div>
//           <div className="stat-label">Last Mood</div>
//         </div>
//       </div>

//       {/* Two column layout */}
//       <div className="card-grid card-grid-2">
//         {/* Mood Check-in */}
//         <div className="card">
//           <h3 style={{ marginBottom: '6px', fontSize: '1.3rem' }}>Today's Check-in</h3>
//           {todayMood ? (
//             <div style={{ textAlign: 'center', padding: '20px 0' }}>
//               <div style={{ fontSize: '3rem', marginBottom: '8px' }}>
//                 {moodOptions.find(m => m.value === todayMood.mood)?.emoji}
//               </div>
//               <p style={{ color: 'var(--charcoal-soft)', marginBottom: '4px' }}>
//                 You logged <strong>{todayMood.moodLabel}</strong> today
//               </p>
//               {todayMood.note && (
//                 <p style={{
//                   fontSize: '0.875rem', color: 'var(--warm-gray)',
//                   fontStyle: 'italic', marginTop: '8px'
//                 }}>
//                   "{todayMood.note}"
//                 </p>
//               )}
//               <button
//                 className="btn btn-ghost btn-sm"
//                 style={{ marginTop: '16px' }}
//                 onClick={() => setTodayMood(null)}
//               >
//                 Update
//               </button>
//             </div>
//           ) : (
//             <div>
//               <p style={{ color: 'var(--warm-gray)', fontSize: '0.9rem', marginBottom: '16px' }}>
//                 How are you feeling right now?
//               </p>
//               <div className="mood-selector">
//                 {moodOptions.map(m => (
//                   <button
//                     key={m.value}
//                     className={`mood-btn ${selectedMood === m.value ? 'selected' : ''}`}
//                     onClick={() => setSelectedMood(m.value)}
//                   >
//                     <span className="mood-emoji">{m.emoji}</span>
//                     <span className="mood-label">{m.label}</span>
//                   </button>
//                 ))}
//               </div>
//               {selectedMood && (
//                 <div>
//                   <textarea
//                     className="form-input form-textarea"
//                     placeholder="Any thoughts to add? (optional)"
//                     value={moodNote}
//                     onChange={e => setMoodNote(e.target.value)}
//                     style={{ marginTop: '12px', minHeight: '80px' }}
//                   />
//                   <button
//                     className="btn btn-primary btn-full"
//                     style={{ marginTop: '12px' }}
//                     onClick={logMood}
//                     disabled={submitting}
//                   >
//                     {submitting ? 'Saving...' : 'Log Mood'}
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Recent Moods */}
//         <div className="card">
//           <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>Mood History</h3>
//           {recentMoods.length === 0 ? (
//             <div className="empty-state" style={{ padding: '30px 0' }}>
//               <div className="empty-state-icon">📊</div>
//               <p>No mood entries yet. Start logging!</p>
//             </div>
//           ) : (
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//               {recentMoods.slice(0, 6).map(entry => (
//                 <div
//                   key={entry._id}
//                   style={{
//                     display: 'flex', alignItems: 'center', gap: '12px',
//                     padding: '10px 14px', borderRadius: '10px',
//                     background: 'var(--cream)'
//                   }}
//                 >
//                   <span style={{ fontSize: '1.4rem' }}>{entry.emoji}</span>
//                   <div style={{ flex: 1 }}>
//                     <div style={{
//                       height: '6px', background: 'var(--cream-dark)',
//                       borderRadius: '3px', overflow: 'hidden'
//                     }}>
//                       <div style={{
//                         height: '100%',
//                         width: `${(entry.mood / 5) * 100}%`,
//                         background: getMoodColor(entry.mood),
//                         borderRadius: '3px',
//                         transition: 'width 0.6s ease'
//                       }} />
//                     </div>
//                   </div>
//                   <span style={{ fontSize: '0.78rem', color: 'var(--warm-gray)', whiteSpace: 'nowrap' }}>
//                     {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                   </span>
//                 </div>
//               ))}
//               <button
//                 className="btn btn-ghost btn-sm"
//                 style={{ marginTop: '8px' }}
//                 onClick={() => navigate('/mood')}
//               >
//                 View Full History →
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div style={{ marginTop: '24px' }}>
//         <h3 style={{ marginBottom: '16px', fontSize: '1.3rem' }}>Quick Start</h3>
//         <div className="card-grid card-grid-3" style={{ gap: '16px' }}>
//           {[
//             { emoji: '🧘', title: 'Breathing Exercise', sub: '5 min • Beginner', path: '/exercises', color: 'var(--sage)' },
//             { emoji: '🤝', title: 'Community Support', sub: 'Connect anonymously', path: '/community', color: 'var(--lavender)' },
//             { emoji: '🔔', title: 'Set a Reminder', sub: 'Stay consistent', path: '/reminders', color: 'var(--gold)' },
//           ].map(item => (
//             <div
//               key={item.title}
//               className="card"
//               style={{ cursor: 'pointer', textAlign: 'center', padding: '24px 20px' }}
//               onClick={() => navigate(item.path)}
//             >
//               <div style={{
//                 width: '60px', height: '60px',
//                 background: `${item.color}20`,
//                 borderRadius: '50%', display: 'flex',
//                 alignItems: 'center', justifyContent: 'center',
//                 fontSize: '1.8rem', margin: '0 auto 12px'
//               }}>
//                 {item.emoji}
//               </div>
//               <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{item.title}</h4>
//               <p style={{ fontSize: '0.82rem', color: 'var(--warm-gray)' }}>{item.sub}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const moodOptions = [
  { value: 1, emoji: '😢', label: 'Depressed' },
  { value: 2, emoji: '😔', label: 'Stressed' },
  { value: 3, emoji: '😐', label: 'Normal' },
  { value: 4, emoji: '😊', label: 'Happy' },
  { value: 5, emoji: '😄', label: 'Excited' },
];

const tips = [
  'Start with just 5 minutes of breathing today. Every breath counts. 🌬️',
  'Your feelings are valid. Take a moment to check in with yourself. 💚',
  'Small steps lead to big changes. Be proud of every effort. 🌱',
  'Remember: you deserve care and compassion — from yourself too. 🤗',
  'Mindfulness isn\'t about perfection. It\'s about presence. 🧘',
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, avgMood: 0, streak: 0 });
  const [recentMoods, setRecentMoods] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const tip = tips[new Date().getDay() % tips.length];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [moodRes, todayRes] = await Promise.all([
        axios.get('/api/mood?limit=7'),
        axios.get('/api/mood/today')
      ]);
      setStats(moodRes.data.stats);
      setRecentMoods(moodRes.data.data);
      setTodayMood(todayRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logMood = async () => {
    if (!selectedMood) return;
    setSubmitting(true);
    try {
      await axios.post('/api/mood', { mood: selectedMood, note: moodNote });
      await fetchData();
      setSelectedMood(null);
      setMoodNote('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMoodColor = (score) => {
    const colors = { 1: '#e88a7a', 2: '#e8c4b8', 3: '#c9a96e', 4: '#a8c5b5', 5: '#7c9f8a' };
    return colors[score] || '#ccc';
  };

  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner" />
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h2>{getGreeting()}, {user?.name?.split(' ')[0]} 🌿</h2>
        <p>How are you feeling today? Take a moment to check in.</p>
      </div>

      {/* Daily Tip */}
      <div className="tip-banner">
        <div>
          <h3>Daily Intention</h3>
          <p>{tip}</p>
        </div>
        <button
          className="btn"
          style={{ background: 'rgba(255,255,255,0.2)', color: 'white', whiteSpace: 'nowrap' }}
          onClick={() => navigate('/exercises')}
        >
          Start Exercise ✨
        </button>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-number">{stats.avgMood || '—'}</div>
          <div className="stat-label">Avg. Mood Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Check-ins</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{recentMoods.length}</div>
          <div className="stat-label">This Week</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {recentMoods[0] ? moodOptions.find(m => m.value === recentMoods[0].mood)?.emoji : '—'}
          </div>
          <div className="stat-label">Last Mood</div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="card-grid card-grid-2">
        {/* Mood Check-in */}
        <div className="card">
          <h3 style={{ marginBottom: '6px', fontSize: '1.3rem' }}>Today's Check-in</h3>
          {todayMood ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>
                {moodOptions.find(m => m.value === todayMood.mood)?.emoji}
              </div>
              <p style={{ color: 'var(--charcoal-soft)', marginBottom: '4px' }}>
                You logged <strong>{todayMood.moodLabel}</strong> today
              </p>
              {todayMood.note && (
                <p style={{
                  fontSize: '0.875rem', color: 'var(--warm-gray)',
                  fontStyle: 'italic', marginTop: '8px'
                }}>
                  "{todayMood.note}"
                </p>
              )}
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: '16px' }}
                onClick={() => setTodayMood(null)}
              >
                Update
              </button>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--warm-gray)', fontSize: '0.9rem', marginBottom: '16px' }}>
                How are you feeling right now?
              </p>
              <div className="mood-selector">
                {moodOptions.map(m => (
                  <button
                    key={m.value}
                    className={`mood-btn ${selectedMood === m.value ? 'selected' : ''}`}
                    onClick={() => setSelectedMood(m.value)}
                  >
                    <span className="mood-emoji">{m.emoji}</span>
                    <span className="mood-label">{m.label}</span>
                  </button>
                ))}
              </div>
              {selectedMood && (
                <div>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Any thoughts to add? (optional)"
                    value={moodNote}
                    onChange={e => setMoodNote(e.target.value)}
                    style={{ marginTop: '12px', minHeight: '80px' }}
                  />
                  <button
                    className="btn btn-primary btn-full"
                    style={{ marginTop: '12px' }}
                    onClick={logMood}
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : 'Log Mood'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent Moods */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>Mood History</h3>
          {recentMoods.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <div className="empty-state-icon">📊</div>
              <p>No mood entries yet. Start logging!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentMoods.slice(0, 6).map(entry => (
                <div
                  key={entry._id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 14px', borderRadius: '10px',
                    background: 'var(--cream)'
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{entry.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      height: '6px', background: 'var(--cream-dark)',
                      borderRadius: '3px', overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(entry.mood / 5) * 100}%`,
                        background: getMoodColor(entry.mood),
                        borderRadius: '3px',
                        transition: 'width 0.6s ease'
                      }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--warm-gray)', whiteSpace: 'nowrap' }}>
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: '8px' }}
                onClick={() => navigate('/mood')}
              >
                View Full History →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.3rem' }}>Quick Start</h3>
        <div className="card-grid card-grid-3" style={{ gap: '16px' }}>
          {[
            { emoji: '🧘', title: 'Breathing Exercise', sub: '5 min • Beginner', path: '/exercises', color: 'var(--sage)' },
            { emoji: '🤝', title: 'Community Support', sub: 'Connect anonymously', path: '/community', color: 'var(--lavender)' },
            { emoji: '🔔', title: 'Set a Reminder', sub: 'Stay consistent', path: '/reminders', color: 'var(--gold)' },
          ].map(item => (
            <div
              key={item.title}
              className="card"
              style={{ cursor: 'pointer', textAlign: 'center', padding: '24px 20px' }}
              onClick={() => navigate(item.path)}
            >
              <div style={{
                width: '60px', height: '60px',
                background: `${item.color}20`,
                borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem', margin: '0 auto 12px'
              }}>
                {item.emoji}
              </div>
              <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{item.title}</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--warm-gray)' }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
