import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error('Please fill in all fields');
    }

    setLoading(true);

    try {
      await login(form.email, form.password);

      toast.success('Welcome back! 🌿');

      // 🔥 CHANGED THIS LINE
      navigate('/mood-checkin');

    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info('Google OAuth would integrate with a real Google App ID');
  };

  const handleFacebookLogin = () => {
    toast.info('Facebook OAuth would integrate with a real Facebook App ID');
  };

  return (
    <div className="auth-page" style={{ position: 'relative' }}>

    <button
      onClick={() => navigate('/')}
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'transparent',
        border: 'none',
        fontSize: '44px',
        cursor: 'pointer'
      }}
    >
      &times;
    </button>
    {/* <div className="auth-page"> */}
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Mind<span>mingle</span></h1>
          <p>Welcome back to your wellness journey</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: '8px' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '0.9rem',
          color: 'var(--warm-gray)'
        }}>
          New to Mindmingle?{' '}
          <Link
            to="/register"
            style={{ color: 'var(--sage)', fontWeight: '600' }}
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;