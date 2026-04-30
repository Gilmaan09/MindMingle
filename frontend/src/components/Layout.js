import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/exercises', icon: '🧘', label: 'Exercises' },
  { path: '/mood', icon: '📊', label: 'Mood Tracker' },
  { path: '/community', icon: '🤝', label: 'Community' },
  { path: '/reminders', icon: '🔔', label: 'Reminders' },
  { path: '/profile', icon: '👤', label: 'Profile' },
  { path: '/assistant', icon: '💬', label: 'Assistant' },
];

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 150, display: 'none'
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h1> Mind<span>mingle</span></h1>
          <p>Your wellness companion</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="nav-item" onClick={handleLogout} style={{ color: 'var(--coral)' }}>
            <span className="nav-icon">🚪</span>
            Sign Out
          </button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
