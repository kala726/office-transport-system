import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  // Get user info from session
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
      navigate('/login');
    }
  };

  return (
    <div className="homepage">
      {/* Header/Welcome Section with User Info */}
      <header className="welcome-section">
        <div className="user-info-bar">
          <div className="welcome-message">
            <span>👋 Welcome, <strong>{user.name || 'User'}</strong>!</span>
            <span className="user-role">{user.role || 'User'}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
        <h1>🚗 Office Transport System</h1>
        <p>Your reliable office transportation partner</p>
      </header>

      {/* Rest of your HomePage code remains the same */}
      {/* Search Bar Section */}
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search for routes, vehicles, or destinations..."
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
      <div className="nav-buttons">
        <div className="button-card">
          <div className="button-icon">🚌</div>
          <h3>Vehicles</h3>
          <p>View all available vehicles</p>
          <Link to="/vehicles">
            <button className="action-button">
              Browse Vehicles →
            </button>
          </Link>
        </div>

        <div className="button-card">
          <div className="button-icon">👥</div>
          <h3>Members</h3>
          <p>View team members and passengers</p>
          <Link to="/members">
            <button className="action-button">
              View Members →
            </button>
          </Link>
        </div>

        <div className="button-card">
          <div className="button-icon">👨‍✈️</div>
          <h3>Drivers</h3>
          <p>View our professional drivers</p>
          <Link to="/drivers">
            <button className="action-button">
              Meet Drivers →
            </button>
          </Link>
        </div>

        <div className="button-card">
          <div className="button-icon">🗺️</div>
          <h3>Trip Planning</h3>
          <p>Plan and manage office trips</p>
          <Link to="/trip-planning">
            <button className="action-button">
              Plan Trip →
            </button>
          </Link>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        {/* ... your existing footer code ... */}
      </footer>
    </div>
  );
};

export default HomePage;