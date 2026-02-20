import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Get user info from session
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  // Security Check: User කෙනෙක් නැත්නම් login එකට යවන්න
  useEffect(() => {
    if (!user.name) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // මෙතනදී ඔබට search results page එකකට navigate වෙන්න පුළුවන්
      console.log('Searching for:', searchTerm);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout(); // App.js හෝ Auth context එකේ session එක clear කරයි
      navigate('/login');
    }
  };

  return (
    <div className="homepage">
      {/* Header/Welcome Section */}
      <header className="welcome-section">
        <div className="user-info-bar">
          <div className="welcome-message">
            <span>👋 Welcome, <strong>{user.name || 'User'}</strong>!</span>
            <span className="user-role-badge">{user.role || 'Member'}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <span>🚪</span> Logout
          </button>
        </div>
        <h1>🚗 Office Transport System</h1>
        <p>Your reliable office transportation partner</p>
      </header>

      {/* Search Bar Section */}
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search for routes, vehicles, or drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button">
              🔍 Search
            </button>
          </div>
        </form>
      </div>

      {/* Navigation Buttons Section */}
      <div className="nav-grid">
        <NavCard
          to="/vehicles"
          icon="🚌"
          title="Vehicles"
          desc="View all available vehicles"
          btnText="Browse Vehicles"
        />
        <NavCard
          to="/members"
          icon="👥"
          title="Members"
          desc="View team members and passengers"
          btnText="View Members"
        />
        <NavCard
          to="/drivers"
          icon="👨‍✈️"
          title="Drivers"
          desc="View our professional drivers"
          btnText="Meet Drivers"
        />
        <NavCard
          to="/trip-planning"
          icon="🗺️"
          title="Trip Planning"
          desc="Plan and manage office trips"
          btnText="Plan Trip"
        />
      </div>

      <footer className="footer">
        <p>&copy; 2026 Office Transport System. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Reusable Component for Cards (Code එක පිරිසිදුව තබා ගැනීමට)
const NavCard = ({ to, icon, title, desc, btnText }) => (
  <div className="button-card">
    <div className="button-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
    <Link to={to} className="action-link-btn">
      {btnText} →
    </Link>
  </div>
);

export default HomePage;