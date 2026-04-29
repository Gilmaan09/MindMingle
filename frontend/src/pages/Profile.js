import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    isAnonymous: user?.isAnonymous || false,
    anonymousName: user?.anonymousName || '',
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profilePic, setProfilePic] = useState(null);

  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem("goals");
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const [newGoal, setNewGoal] = useState({ title: '', target: '', unit: 'days' });
  const [addingGoal, setAddingGoal] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put('/api/auth/profile', form);
      setUser(data.user);
      toast.success('Profile updated! ✅');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.target) return toast.error('Please fill in goal details');
    const goal = { ...newGoal, target: parseInt(newGoal.target), current: 0, id: Date.now() };
    setGoals(g => [...g, goal]);
    setNewGoal({ title: '', target: '', unit: 'days' });
    setAddingGoal(false);
    toast.success('Goal added! 🎯');
  };

  // const updateGoalProgress = (idx, delta) => {
  //   setGoals(g => g.map((goal, i) => {
  //     if (i !== idx) return goal;
  //     return { ...goal, current: Math.max(0, Math.min(goal.target, goal.current + delta)) };
  //   }));
  // };
//   const updateGoalProgress = (idx, delta) => {
//   setGoals(g => {
//     const updated = g.map((goal, i) => {
//       if (i !== idx) return goal;

//       return {
//         ...goal,
//         current: Math.max(
//           0,
//           Math.min(goal.target, goal.current + delta)
//         )
//       };
//     });

//     // 🔥 REMOVE completed goals
//     return updated.filter(goal => goal.current < goal.target);
//   });
// };
const updateGoalProgress = (idx, delta) => {
  setGoals((prev) => {
    return prev.map((goal, i) => {
      if (i !== idx) return goal;

      const newCurrent = Math.max(
        0,
        Math.min(goal.target, goal.current + delta)
      );

      // 🎉 If completed
      if (newCurrent === goal.target) {
        // show message
        setTimeout(() => {
          setGoals((g) =>
            g.filter((item) => item.id !== goal.id)
          );
        }, 3000); // wait 1.5 sec
      }

      return { ...goal, current: newCurrent };
    });
  });
};
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };


  const avatarLetter = user?.name?.charAt(0).toUpperCase();
  const gradients = [
    'linear-gradient(135deg, #7c9f8a, #b5aed1)',
    'linear-gradient(135deg, #c9a96e, #e8c4b8)',
    'linear-gradient(135deg, #9ec4d0, #7c9f8a)',
  ];


  return (
    <div>
      <div className="page-header">
        <h2>My Profile</h2>
        <p>Manage your account and personal goals</p>
      </div>

      {/* Profile Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '28px', padding: '28px 32px' }}>
        <div style={{ textAlign: "center" }}>

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            id="profileUpload"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          {/* Avatar */}
          <label htmlFor="profileUpload" style={{ cursor: "pointer" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                overflow: "hidden",
                background: "#ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "2rem", color: "#555" }}>{avatarLetter}</span>
              )}
            </div>
          </label>

          <p style={{ fontSize: "12px", marginTop: "6px", color: "#888" }}>
            <b>Add Profile Pic</b>
          </p>

        </div>

        <div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{user?.name}</h3>
          <p style={{ color: 'var(--warm-gray)', fontSize: '0.9rem' }}>{user?.email}</p>
          {user?.bio && <p style={{ marginTop: '6px', color: 'var(--charcoal-soft)', fontSize: '0.9rem' }}>{user.bio}</p>}
          <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
            <span className="badge badge-sage">
              {user?.authProvider === 'google' ? '🔵 Google' : '📧 Email'}
            </span>
            {user?.isAnonymous && (
              <span className="badge badge-lavender">🔒 Anonymous Mode</span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          👤 Edit Profile
        </button>
        <button className={`tab-btn ${activeTab === 'goals' ? 'active' : ''}`} onClick={() => setActiveTab('goals')}>
          🎯 My Goals
        </button>
        <button className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`} onClick={() => setActiveTab('privacy')}>
          🔒 Privacy
        </button>
      </div>

      {/* Edit Profile */}
      {activeTab === 'profile' && (
        <div className="card" style={{ maxWidth: '560px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Personal Information</h3>

          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input
              type="text"
              className="form-input"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bio (optional)</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Share a little about yourself and your wellness journey..."
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              style={{ minHeight: '80px' }}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={saveProfile}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Goals */}
      {activeTab === 'goals' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem' }}>My Wellness Goals</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setAddingGoal(!addingGoal)}>
              {addingGoal ? '✕ Cancel' : '+ Add Goal'}
            </button>
          </div>

          {addingGoal && (
            <div className="card" style={{ marginBottom: '16px' }}>
              <div className="card-grid card-grid-3" style={{ gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Goal Title</label>
                  <input className="form-input" placeholder="e.g. Meditate daily" value={newGoal.title}
                    onChange={e => setNewGoal(g => ({ ...g, title: e.target.value }))} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Target</label>
                  <input type="number" className="form-input" placeholder="e.g. 30" value={newGoal.target}
                    onChange={e => setNewGoal(g => ({ ...g, target: e.target.value }))} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Unit</label>
                  <select className="form-input" value={newGoal.unit}
                    onChange={e => setNewGoal(g => ({ ...g, unit: e.target.value }))}>
                    <option value="days">Days</option>
                    <option value="sessions">Sessions</option>
                    <option value="minutes">Minutes</option>
                    <option value="times">Times</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={addGoal}>Add Goal</button>
            </div>
          )}

          {goals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎯</div>
              <h3>No goals yet</h3>
              <p>Set personal wellness goals to track your progress</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {goals.map((goal, idx) => {
                const pct = goal.target > 0 ? Math.min(100, (goal.current / goal.target) * 100) : 0;
                return (
                  <div key={goal.id || idx} className="card" style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '1rem' }}>{goal.title}</h4>
                      <span className="badge badge-sage">
                        {goal.current}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    <div style={{ background: 'var(--cream-dark)', borderRadius: '4px', height: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: pct === 100 ? 'var(--sage)' : 'linear-gradient(90deg, var(--sage-light), var(--sage))',
                        borderRadius: '4px', transition: 'width 0.5s ease'
                      }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => updateGoalProgress(idx, 1)}>
                        + Progress
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => updateGoalProgress(idx, -1)}>
                        − Undo
                      </button>
                      {pct === 100 && <span style={{ marginLeft: 'auto', fontSize: '1.2rem', color:'green',fontWeight:'600' }}>🎉 Goal Completed</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Privacy */}
      {activeTab === 'privacy' && (
        <div className="card" style={{ maxWidth: '560px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Privacy Settings</h3>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>Anonymous Mode</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--warm-gray)' }}>
                  When enabled, your name won't be shown in community posts
                </p>
              </div>
              <label className="toggle" style={{ flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={form.isAnonymous}
                  onChange={e => setForm(f => ({ ...f, isAnonymous: e.target.checked }))}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          {form.isAnonymous && (
            <div className="form-group">
              <label className="form-label">Anonymous Display Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. WellnessSeeker, MindfulSoul..."
                value={form.anonymousName}
                onChange={e => setForm(f => ({ ...f, anonymousName: e.target.value }))}
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--warm-gray)', marginTop: '6px' }}>
                This name will appear on your community posts instead of your real name
              </p>
            </div>
          )}

          <button className="btn btn-primary" onClick={saveProfile} disabled={saving}>
            {saving ? 'Saving...' : 'Save Privacy Settings'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
