import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    time: '08:00',
    frequency: 'daily',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    message: 'Time for your mindfulness practice! 🧘'
  });
  const [submitting, setSubmitting] = useState(false);

  // useEffect(() => { fetchReminders(); }, []);
  useEffect(() => {
  fetchReminders();

  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}, []);

// useEffect(() => {
//   const interval = setInterval(() => {
//     const now = new Date();
//     const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

//     reminders.forEach(reminder => {
//       if (
//         reminder.isActive &&
//         reminder.time === currentTime
//       ) {
//         new Notification("MindMingle Reminder 🔔", {
//           body: reminder.message,
//         });
//       }
//     });

//   }, 60000);

//   return () => clearInterval(interval);
// }, [reminders]);
useEffect(() => {
  const interval = setInterval(() => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const today = now.toLocaleDateString('en-US', { weekday: 'short' });

    reminders.forEach(reminder => {
      if (
        reminder.isActive &&
        reminder.time === currentTime && now.getSeconds()===0 &&
        (
          reminder.frequency === 'daily' ||
          (reminder.frequency === 'weekly' && reminder.days.includes(today)) ||
          (reminder.frequency === 'custom' && reminder.days.includes(today))
        )
      ) {
        new Notification("MindMingle Reminder 🔔", {
          body: reminder.message,
        });
      }
    });

  }, 1000);

  return () => clearInterval(interval);
}, [reminders]);
  

  const fetchReminders = async () => {
    try {
      const { data } = await axios.get('/api/reminders');
      setReminders(data.data);
    } catch { } finally { setLoading(false); }
  };

  const addReminder = async () => {
    if (!form.time) return toast.error('Please set a time');
    setSubmitting(true);
    try {
      await axios.post('/api/reminders', form);
      toast.success('Reminder created! 🔔');
      setShowForm(false);
      setForm({ time: '08:00', frequency: 'daily', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], message: 'Time for your mindfulness practice! 🧘' });
      fetchReminders();
    } catch { toast.error('Failed to create reminder'); }
    finally { setSubmitting(false); }
  };

  const toggleReminder = async (id, isActive) => {
    try {
      await axios.put(`/api/reminders/${id}`, { isActive: !isActive });
      fetchReminders();
    } catch { }
  };

  const deleteReminder = async (id) => {
    try {
      await axios.delete(`/api/reminders/${id}`);
      toast.success('Reminder deleted');
      fetchReminders();
    } catch { }
  };

  const toggleDay = (day) => {
    setForm(f => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter(d => d !== day) : [...f.days, day]
    }));
  };

  const formatTime12 = (time24) => {
    const [h, m] = time24.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  const presets = [
    { label: 'Morning', time: '07:00', message: 'Good morning! Start your day mindfully 🌅' },
    { label: 'Noon', time: '12:00', message: 'Midday check-in: take a mindful break 🌿' },
    { label: 'Evening', time: '18:00', message: 'Wind down with a mindfulness exercise 🌙' },
    { label: 'Bedtime', time: '21:00', message: 'Prepare for restful sleep 😴' },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Reminders</h2>
          <p>Stay consistent with your mindfulness practice</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Reminder'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div className="stat-card" style={{ flex: 1, minWidth: '120px' }}>
          <div className="stat-number">{reminders.length}</div>
          <div className="stat-label">Total Reminders</div>
        </div>
        <div className="stat-card" style={{ flex: 1, minWidth: '120px', borderLeftColor: 'var(--sage)' }}>
          <div className="stat-number">{reminders.filter(r => r.isActive).length}</div>
          <div className="stat-label">Active</div>
        </div>
      </div>

      {/* Quick presets */}
      {!showForm && reminders.length === 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Quick Start Presets</h3>
          <div className="card-grid card-grid-4" style={{ gap: '12px' }}>
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => {
                  setForm(f => ({ ...f, time: p.time, message: p.message }));
                  setShowForm(true);
                }}
                style={{
                  padding: '16px', background: 'var(--cream)',
                  border: '1.5px solid var(--cream-dark)', borderRadius: 'var(--radius-md)',
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
                  fontFamily: 'DM Sans, sans-serif'
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>
                  {p.label === 'Morning' ? '🌅' : p.label === 'Noon' ? '☀️' : p.label === 'Evening' ? '🌆' : '🌙'}
                </div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{p.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--warm-gray)' }}>{p.time}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>New Reminder</h3>

          <div className="card-grid card-grid-2" style={{ gap: '20px', marginBottom: '20px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Time</label>
              <input
                type="time"
                className="form-input"
                value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Frequency</label>
              <select
                className="form-input"
                value={form.frequency}
                onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom Days</option>
              </select>
            </div>
          </div>

          {(form.frequency === 'custom' || form.frequency === 'weekly') && (
            <div className="form-group">
              <label className="form-label">Days</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {days.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      border: '2px solid',
                      borderColor: form.days.includes(day) ? 'var(--sage)' : 'var(--cream-dark)',
                      background: form.days.includes(day) ? 'var(--sage)' : 'white',
                      color: form.days.includes(day) ? 'white' : 'var(--charcoal-soft)',
                      cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600',
                      transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif'
                    }}
                  >
                    {day.charAt(0)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Reminder Message</label>
            <input
              type="text"
              className="form-input"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Your reminder message..."
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button className="btn btn-primary" onClick={addReminder} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Reminder'}
            </button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reminders List */}
      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : reminders.length === 0 && !showForm ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔔</div>
          <h3>No reminders yet</h3>
          <p>Set up reminders to build a consistent mindfulness habit</p>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => setShowForm(true)}>
            Create First Reminder
          </button>
        </div>
      ) : (
        <div>
          {reminders.map(reminder => (
            <div key={reminder._id} className="reminder-item">
              <div className="reminder-time">
                {formatTime12(reminder.time)}
              </div>
              <div className="reminder-details">
                <div className="reminder-message">{reminder.message}</div>
                <div className="reminder-freq">
                  {reminder.frequency === 'daily' ? '🔁 Every day' :
                    reminder.frequency === 'weekly' ? '📅 Weekly' :
                      `📅 ${reminder.days?.join(', ') || 'Custom'}`}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={reminder.isActive}
                    onChange={() => toggleReminder(reminder._id, reminder.isActive)}
                  />
                  <span className="toggle-slider" />
                </label>
                <button
                  onClick={() => deleteReminder(reminder._id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--warm-gray)', fontSize: '1rem', padding: '4px'
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reminders;
