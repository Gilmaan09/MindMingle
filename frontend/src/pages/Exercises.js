// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const categoryIcons = {
//   breathing: '🌬️', meditation: '🧘', 'body-scan': '🫁',
//   visualization: '🌅', journaling: '📝', movement: '🤸'
// };

// const difficultyColors = {
//   beginner: 'badge-sage', intermediate: 'badge-gold', advanced: 'badge-coral'
// };

// const ExerciseModal = ({ exercise, onClose }) => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [started, setStarted] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [timerActive, setTimerActive] = useState(false);

//   useEffect(() => {
//     if (exercise) setTimeLeft(exercise.duration * 60);
//   }, [exercise]);

//   useEffect(() => {
//     let interval;
//     if (timerActive && timeLeft > 0) {
//       interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
//     } else if (timeLeft === 0 && timerActive) {
//       setTimerActive(false);
//       toast.success('Exercise complete! Great job! 🎉');
//     }
//     return () => clearInterval(interval);
//   }, [timerActive, timeLeft]);

//   const formatTime = (secs) => {
//     const m = Math.floor(secs / 60).toString().padStart(2, '0');
//     const s = (secs % 60).toString().padStart(2, '0');
//     return `${m}:${s}`;
//   };

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
//         <button className="modal-close" onClick={onClose}>✕</button>

//         <div style={{ marginBottom: '24px' }}>
//           <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
//             {categoryIcons[exercise.category]}
//           </div>
//           <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{exercise.title}</h2>
//           <p style={{ color: 'var(--warm-gray)', marginBottom: '12px' }}>{exercise.description}</p>

//           <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
//             <span className={`badge ${difficultyColors[exercise.difficulty]}`}>
//               {exercise.difficulty}
//             </span>
//             <span className="badge badge-lavender">⏱ {exercise.duration} min</span>
//           </div>
//         </div>

//         {/* Timer */}
//         <div style={{
//           background: 'var(--cream)', borderRadius: 'var(--radius-md)',
//           padding: '20px', textAlign: 'center', marginBottom: '24px'
//         }}>
//           <div style={{
//             fontSize: '3rem', fontFamily: 'Playfair Display, serif',
//             color: timerActive ? 'var(--sage)' : 'var(--charcoal)',
//             transition: 'color 0.3s'
//           }}>
//             {formatTime(timeLeft)}
//           </div>
//           <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '12px' }}>
//             <button
//               className={`btn ${timerActive ? 'btn-secondary' : 'btn-primary'} btn-sm`}
//               onClick={() => setTimerActive(t => !t)}
//             >
//               {timerActive ? '⏸ Pause' : '▶ Start Timer'}
//             </button>
//             <button
//               className="btn btn-secondary btn-sm"
//               onClick={() => { setTimeLeft(exercise.duration * 60); setTimerActive(false); }}
//             >
//               ↩ Reset
//             </button>
//           </div>
//         </div>

//         {/* Instructions */}
//         {exercise.instructions?.length > 0 && (
//           <div>
//             <h4 style={{ marginBottom: '12px', fontSize: '1rem' }}>Instructions</h4>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//               {exercise.instructions.map((inst, i) => (
//                 <div
//                   key={i}
//                   style={{
//                     display: 'flex', gap: '12px', padding: '12px 16px',
//                     background: currentStep === i ? 'rgba(124,159,138,0.12)' : 'var(--cream)',
//                     borderRadius: 'var(--radius-sm)',
//                     border: currentStep === i ? '1.5px solid var(--sage-light)' : '1.5px solid transparent',
//                     cursor: 'pointer', transition: 'all 0.2s'
//                   }}
//                   onClick={() => setCurrentStep(i)}
//                 >
//                   <span style={{
//                     width: '24px', height: '24px', background: currentStep === i ? 'var(--sage)' : 'var(--cream-dark)',
//                     color: currentStep === i ? 'white' : 'var(--warm-gray)',
//                     borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     fontSize: '0.75rem', fontWeight: '600', flexShrink: 0
//                   }}>
//                     {inst.step}
//                   </span>
//                   <p style={{ fontSize: '0.9rem', color: 'var(--charcoal-soft)', lineHeight: 1.5 }}>
//                     {inst.text}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Benefits */}
//         {exercise.benefits?.length > 0 && (
//           <div style={{ marginTop: '20px' }}>
//             <h4 style={{ marginBottom: '10px', fontSize: '1rem' }}>Benefits</h4>
//             <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
//               {exercise.benefits.map(b => (
//                 <span key={b} className="badge badge-sage">✓ {b}</span>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const Exercises = () => {
//   const [exercises, setExercises] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selected, setSelected] = useState(null);
//   const [filter, setFilter] = useState('all');
//   const [seeding, setSeeding] = useState(false);

//   useEffect(() => {
//     fetchExercises();
//   }, [filter]);

//   const fetchExercises = async () => {
//     try {
//       const params = filter !== 'all' ? `?category=${filter}` : '';
//       const { data } = await axios.get(`/api/exercises${params}`);
//       setExercises(data.data);
//     } catch {
//       setExercises([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const seedExercises = async () => {
//     setSeeding(true);
//     try {
//       await axios.post('/api/exercises/seed');
//       toast.success('Exercises loaded!');
//       fetchExercises();
//     } catch {
//       toast.error('Seeding failed');
//     } finally {
//       setSeeding(false);
//     }
//   };

//   const categories = [
//     { value: 'all', label: 'All', emoji: '✨' },
//     { value: 'breathing', label: 'Breathing', emoji: '🌬️' },
//     { value: 'meditation', label: 'Meditation', emoji: '🧘' },
//     { value: 'body-scan', label: 'Body Scan', emoji: '🫁' },
//     { value: 'visualization', label: 'Visualize', emoji: '🌅' },
//     { value: 'journaling', label: 'Journal', emoji: '📝' },
//     { value: 'movement', label: 'Movement', emoji: '🤸' },
//   ];

//   return (
//     <div>
//       <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//         <div>
//           <h2>Mindfulness Exercises</h2>
//           <p>Curated practices to support your mental wellness</p>
//         </div>
//         {exercises.length === 0 && (
//           <button className="btn btn-primary" onClick={seedExercises} disabled={seeding}>
//             {seeding ? 'Loading...' : '+ Load Exercises'}
//           </button>
//         )}
//       </div>

//       {/* Filter tabs */}
//       <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
//         {categories.map(c => (
//           <button
//             key={c.value}
//             onClick={() => setFilter(c.value)}
//             className="btn"
//             style={{
//               padding: '8px 18px',
//               background: filter === c.value ? 'var(--sage)' : 'var(--white)',
//               color: filter === c.value ? 'white' : 'var(--charcoal-soft)',
//               border: filter === c.value ? 'none' : '1.5px solid var(--cream-dark)',
//               boxShadow: filter === c.value ? '0 4px 12px rgba(124,159,138,0.3)' : 'none',
//             }}
//           >
//             {c.emoji} {c.label}
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <div className="loading-spinner"><div className="spinner" /></div>
//       ) : exercises.length === 0 ? (
//         <div className="empty-state">
//           <div className="empty-state-icon">🧘</div>
//           <h3>No exercises yet</h3>
//           <p>Click "Load Exercises" to populate the library</p>
//           <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={seedExercises}>
//             Load Exercise Library
//           </button>
//         </div>
//       ) : (
//         <div className="card-grid card-grid-3">
//           {exercises.map(ex => (
//             <div key={ex._id} className="exercise-card" onClick={() => setSelected(ex)}>
//               <div className={`exercise-card-header ${ex.category}`}>
//                 <div className="exercise-card-icon">{categoryIcons[ex.category]}</div>
//                 <div className="exercise-card-title">{ex.title}</div>
//                 {ex.isFeatured && (
//                   <span style={{
//                     position: 'absolute', top: '12px', right: '12px',
//                     background: 'rgba(255,255,255,0.3)', color: 'white',
//                     padding: '2px 8px', borderRadius: '20px', fontSize: '0.72rem'
//                   }}>
//                     ⭐ Featured
//                   </span>
//                 )}
//               </div>
//               <div className="exercise-card-body">
//                 <div className="exercise-meta">
//                   <span className="exercise-tag">⏱ {ex.duration} min</span>
//                   <span className="exercise-tag">{ex.difficulty}</span>
//                 </div>
//                 <p style={{
//                   fontSize: '0.875rem', color: 'var(--charcoal-soft)',
//                   lineHeight: 1.6, display: '-webkit-box',
//                   WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
//                 }}>
//                   {ex.description}
//                 </p>
//                 <button className="btn btn-primary btn-sm" style={{ marginTop: '14px', width: '100%' }}>
//                   Start Exercise →
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {selected && <ExerciseModal exercise={selected} onClose={() => setSelected(null)} />}
//     </div>
//   );
// };

// export default Exercises;


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
  movement: '🤸'
};

const difficultyColors = {
  beginner: 'badge-sage',
  intermediate: 'badge-gold',
  advanced: 'badge-coral'
};

const moodCategoryMap = {
  sad: 'journaling',
  happy: 'movement',
  anxious: 'breathing',
  stressed: 'meditation',
  tired: 'body-scan',
  calm: 'visualization'
};

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
const [stepIndex, setStepIndex] = useState(0);
const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    fetchExercises();
  }, []);

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
    setTimeLeft(t => {
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
    setStepIndex(prev =>
      (prev + 1) % selected.instructions.length
    );
  }, 4000);

  return () => clearInterval(interval);
}, [isPlaying, selected]);

  const fetchExercises = async () => {
    try {
      const res = await axios.get('/api/exercises');

      if (Array.isArray(res.data)) {
        setExercises(res.data);
      } else if (Array.isArray(res.data.data)) {
        setExercises(res.data.data);
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

  const filteredExercises =
    Array.isArray(exercises)
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

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setFilter(c.value)}
            className="btn"
            style={{
              background: filter === c.value ? 'var(--sage)' : 'var(--white)',
              color: filter === c.value ? 'white' : 'var(--charcoal-soft)'
            }}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Loading */}
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
            <div key={ex._id} className="exercise-card" onClick={() => {
  setSelected(ex);
  setIsPlaying(true);
  setStepIndex(0);
  setTimeLeft(ex.duration * 60);
}}>
              <div className={`exercise-card-header ${ex.category}`}>
                <div className="exercise-card-icon">
                  {categoryIcons[ex.category]}
                </div>
                <div className="exercise-card-title">{ex.title}</div>
              </div>

              <div className="exercise-card-body">
                <div className="exercise-meta">
                  <span className="exercise-tag">⏱ {ex.duration} min</span>
                  <span className="exercise-tag">{ex.difficulty}</span>
                </div>

                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--charcoal-soft)',
                  lineHeight: 1.6
                }}>
                  {ex.description}
                </p>

                <button
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: '14px', width: '100%' }}
                >
                  Start Exercise →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>

            <h2>{selected.title}</h2>
            <p>{selected.description}</p>

            <div style={{ marginTop: '10px' }}>
              <span className={`badge ${difficultyColors[selected.difficulty]}`}>
                {selected.difficulty}
              </span>
              <span className="badge badge-lavender">
                ⏱ {selected.duration} min
              </span>
            </div>

            {/* {selected.instructions?.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4>Instructions</h4>
                {selected.instructions.map((step, i) => (
                  <p key={i}>{step.step}. {step.text}</p>
                ))}
              </div>
            )} */}
            {isPlaying && selected.instructions?.length > 0 && (
  <div style={{ textAlign: 'center', marginTop: '20px' }}>
    {/* <div className="breathing-circle"></div> */}
    <div className="person-animation"></div>

    <h3>
      Step {stepIndex + 1}
    </h3>

    <p style={{ fontSize: '1.1rem' }}>
      {selected.instructions[stepIndex].text}
    </p>

    <p>⏱ {timeLeft}s remaining</p>
  </div>
)}

            {selected.benefits?.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4>Benefits</h4>
                {selected.benefits.map((b, i) => (
                  <span key={i} className="badge badge-sage">✓ {b}</span>
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