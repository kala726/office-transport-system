import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [members, setMembers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

  // Get user info from session
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  // Security Check
  useEffect(() => {
    if (!user.name) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch Drivers and Members for search functionality
  useEffect(() => {
    const fetchData = async () => {
      try {
        const driversRes = await axios.get(`${API_URL}/api/drivers`);
        setDrivers(driversRes.data?.data || driversRes.data || []);

        const membersRes = await axios.get(`${API_URL}/api/members`);
        setMembers(membersRes.data?.data || membersRes.data || []);
      } catch (err) {
        console.error("Error fetching data for search:", err);
      }
    };
    fetchData();
  }, []);

  const filteredDrivers = (Array.isArray(drivers) ? drivers : []).filter(driver =>
    driver?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMembers = (Array.isArray(members) ? members : []).filter(member =>
    member?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showSearchResults = searchTerm.trim().length > 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
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
              placeholder="Search for members or drivers by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearching(true);
              }}
              onFocus={() => setIsSearching(true)}
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-button"
                onClick={() => setSearchTerm('')}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: '0 10px', color: '#666' }}
              >
                ✕
              </button>
            )}
            <button type="submit" className="search-button">
              🔍 Search
            </button>
          </div>
        </form>

        {/* Search Results Dropdown */}
        {showSearchResults && isSearching && (
          <div className="search-results-dropdown">
            {filteredDrivers.length === 0 && filteredMembers.length === 0 ? (
              <div className="search-no-results">No results found for "{searchTerm}"</div>
            ) : (
              <>
                {filteredDrivers.length > 0 && (
                  <div className="search-category">
                    <h4>👨‍✈️ Drivers</h4>
                    <ul>
                      {filteredDrivers.map(driver => (
                        <li key={driver._id} className="search-result-item">
                          <div className="result-info">
                            <span className="result-name">{driver.name}</span>
                            <span className="result-subtext">{driver.phone} • {driver.homeTown || 'N/A'}</span>
                          </div>
                          <span className={`result-status ${driver.status === 'Active' ? 'status-active' : 'status-other'}`}>
                            {driver.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {filteredMembers.length > 0 && (
                  <div className="search-category">
                    <h4>👥 Members</h4>
                    <ul>
                      {filteredMembers.map(member => (
                        <li key={member._id} className="search-result-item" onClick={() => navigate('/members')}>
                          <div className="result-info">
                            <span className="result-name">{member.name}</span>
                            <span className="result-subtext">{member.phone} • {member.nearTown || 'N/A'}</span>
                          </div>
                          <span className={`result-status ${(member.status || 'Active') === 'Active' ? 'status-active' : 'status-other'}`}>
                            {member.status || 'Active'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons Section */}
      <div className="nav-buttons"> {/* CSS එකේ තියෙන class එකට වෙනස් කළා */}
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

      {/* Footer Section - CSS එකේ තියෙන විදියටම සකස් කළා */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/vehicles">Vehicles</Link></li>
              <li><Link to="/drivers">Drivers</Link></li>
              <li><Link to="/members">Members</Link></li>
              <li><Link to="/trip-planning">Trip Planning</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <p>Email: ranathungakalana8@gmail.com / dewthilinipabasara@gmail.com</p>
            <p>Hotline: +94 764249952 / +94 787361304

            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Office Transport System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const NavCard = ({ to, icon, title, desc, btnText }) => (
  <div className="button-card">
    <div className="button-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
    <Link to={to} className="action-button" style={{ textDecoration: 'none', display: 'inline-block' }}>
      {btnText} →
    </Link>
  </div>
);

export default HomePage;