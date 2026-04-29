import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const moodOptions = [
  { value: 1, emoji: '😢', label: 'Depressed', color: '#e88a7a' },
  { value: 2, emoji: '😔', label: 'Stressed', color: '#e8c4b8' },
  { value: 3, emoji: '😐', label: 'Normal', color: '#c9a96e' },
  { value: 4, emoji: '😊', label: 'Happy', color: '#a8c5b5' },
  { value: 5, emoji: '😄', label: 'Excited', color: '#7c9f8a' },
];

const activityTags = [
  'Exercise', 'Sleep Well', 'Healthy Eating', 'Social', 'Work',
  'Creative', 'Nature', 'Meditation', 'Reading', 'Music'
];

const MoodTracker = () => {
  const [moods, setMoods] = useState([]);
  const [stats, setStats] = useState({ total: 0, avgMood: 0, moodCounts: {} });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('log');
  const [form, setForm] = useState({ mood: null, note: '', tags: [], activities: [] });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchMoods(); }, []);

  const fetchMoods = async () => {
    try {
      const { data } = await axios.get('/api/mood?limit=30');
      setMoods(data.data);
      setStats(data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitMood = async () => {
    if (!form.mood) return toast.error('Please select your mood');
    setSubmitting(true);
    try {
      await axios.post('/api/mood', form);
      toast.success('Mood logged! 🌟');
      setForm({ mood: null, note: '', tags: [], activities: [] });
      fetchMoods();
      setActiveTab('history');
    } catch (err) {
      toast.error('Failed to log mood');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMood = async (id) => {
    try {
      await axios.delete(`/api/mood/${id}`);
      toast.success('Entry deleted');
      fetchMoods();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const toggleTag = (tag) => {
    setForm(f => ({
      ...f,
      activities: f.activities.includes(tag)
        ? f.activities.filter(t => t !== tag)
        : [...f.activities, tag]
    }));
  };

  // Chart data
  const chartData = {
    labels: moods.slice(0, 14).reverse().map(m =>
      new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric',hour:'2-digit',minute:'2-digit' })
    ),
    datasets: [{
      label: 'Mood Score',
      data: moods.slice(0, 14).reverse().map(m => m.mood),
      borderColor: '#7c9f8a',
      backgroundColor: 'rgba(124,159,138,0.1)',
      borderWidth: 2.5,
      pointBackgroundColor: '#7c9f8a',
      pointRadius: 5,
      tension: 0.4,
      fill: true,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const mood = moodOptions.find(m => m.value === ctx.raw);
            return ` ${mood?.emoji} ${mood?.label}`;
          }
        }
      }
    },
    scales: {
      y: { min: 0, max: 5.5, ticks: { stepSize: 1, callback: v => moodOptions[v - 1]?.emoji || '' } },
      x: { grid: { display: false } }
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h2>Mood Tracker</h2>
        <p>Track your emotional patterns and identify trends</p>
      </div>

      {/* Stats Row */}
      <div className="stats-bar" style={{ marginBottom: '28px' }}>
        <div className="stat-card">
          <div className="stat-number">{stats.avgMood || '—'}</div>
          <div className="stat-label">Average Mood</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Entries</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.moodCounts?.[4] + stats.moodCounts?.[5] || 0}</div>
          <div className="stat-label">Happy Count</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {moods.length > 0 ? moodOptions.find(m => m.value === moods[0].mood)?.emoji : '—'}
          </div>
          <div className="stat-label">Latest</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'log' ? 'active' : ''}`} onClick={() => setActiveTab('log')}>
          + Log Mood
        </button>
        <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          📋 History
        </button>
        <button className={`tab-btn ${activeTab === 'chart' ? 'active' : ''}`} onClick={() => setActiveTab('chart')}>
          📈 Chart
        </button>
      </div>

      {/* Log Mood Tab */}
      {activeTab === 'log' && (
        <div className="card" style={{ maxWidth: '640px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>How are you feeling?</h3>

          <div className="mood-selector" style={{ justifyContent: 'flex-start' }}>
            {moodOptions.map(m => (
              <button
                key={m.value}
                className={`mood-btn ${form.mood === m.value ? 'selected' : ''}`}
                onClick={() => setForm(f => ({ ...f, mood: m.value }))}
              >
                <span className="mood-emoji">{m.emoji}</span>
                <span className="mood-label">{m.label}</span>
              </button>
            ))}
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label className="form-label">What's on your mind?</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Share any thoughts, feelings, or reflections... (optional)"
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Activities Today</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {activityTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem',
                    border: '1.5px solid',
                    borderColor: form.activities.includes(tag) ? 'var(--sage)' : 'var(--cream-dark)',
                    background: form.activities.includes(tag) ? 'rgba(124,159,138,0.12)' : 'white',
                    color: form.activities.includes(tag) ? 'var(--sage-dark)' : 'var(--warm-gray)',
                    cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif'
                  }}
                >
                  {form.activities.includes(tag) ? '✓ ' : ''}{tag}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={submitMood}
            disabled={submitting || !form.mood}
          >
            {submitting ? 'Saving...' : 'Save Mood Entry'}
          </button>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          {moods.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <h3>No entries yet</h3>
              <p>Start logging your mood to see your history</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {moods.map(entry => (
                <div key={entry._id} className="card" style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                      <span style={{ fontSize: '2rem' }}>{entry.emoji}</span>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--charcoal)' }}>{entry.moodLabel}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--warm-gray)' }}>
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'short', month: 'long', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                        {entry.note && (
                          <p style={{
                            marginTop: '8px', fontSize: '0.875rem',
                            color: 'var(--charcoal-soft)', fontStyle: 'italic',
                            maxWidth: '400px'
                          }}>
                            "{entry.note}"
                          </p>
                        )}
                        {entry.activities?.length > 0 && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                            {entry.activities.map(a => (
                              <span key={a} className="badge badge-sage" style={{ fontSize: '0.72rem' }}>{a}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMood(entry._id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--warm-gray)', fontSize: '1rem', padding: '4px',
                        borderRadius: '6px', transition: 'all 0.2s'
                      }}
                      title="Delete entry"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chart Tab */}
      {activeTab === 'chart' && (
        <div className="card">
          <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>Mood Trend</h3>
          {moods.length < 2 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📈</div>
              <p>Log at least 2 moods to see your trend chart</p>
            </div>
          ) : (
            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </div>
          )}

          {/* Mood breakdown */}
          {stats.total > 0 && (
            <div style={{ marginTop: '28px' }}>
              <h4 style={{ marginBottom: '14px' }}>Mood Breakdown</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {moodOptions.reverse().map(m => {
                  const count = stats.moodCounts[m.value] || 0;
                  const pct = stats.total > 0 ? (count / stats.total * 100).toFixed(0) : 0;
                  return (
                    <div key={m.value} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ width: '28px', textAlign: 'center' }}>{m.emoji}</span>
                      <span style={{ width: '70px', fontSize: '0.82rem', color: 'var(--charcoal-soft)' }}>
                        {m.label}
                      </span>
                      <div style={{ flex: 1, height: '8px', background: 'var(--cream-dark)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${pct}%`,
                          background: m.color, borderRadius: '4px',
                          transition: 'width 0.8s ease'
                        }} />
                      </div>
                      <span style={{ width: '40px', fontSize: '0.82rem', color: 'var(--warm-gray)', textAlign: 'right' }}>
                        {count}×
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
