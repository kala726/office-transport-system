import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Drivers.css';

const Drivers = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');
  // States
  const [drivers, setDrivers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const initialDriverState = {
    name: '',
    phone: '',
    idNumber: '',
    homeTown: '',
    status: 'Active',
    address: ''
  };

  const [newDriver, setNewDriver] = useState(initialDriverState);

  // --- 1. Database එකෙන් Driversලා ගෙන්වා ගැනීම ---
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/drivers`);
        setDrivers(res.data);
      } catch (err) {
        console.error("Drivers ලබා ගැනීමේ දෝෂයක්:", err);
      }
    };
    fetchDrivers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDriver({ ...newDriver, [name]: value });
  };

  // --- 2. Driver කෙනෙක් Database එකට Save කිරීම ---
  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/drivers/add`, newDriver);
      setDrivers([...drivers, res.data]);
      setShowAddForm(false);
      setNewDriver(initialDriverState);
      alert('Driver registered successfully!');
    } catch (err) {
      console.error("Save error:", err);
      alert('Failed to save driver. Check if backend is running!');
    }
  };

  // --- 3. Driver කෙනෙක් Database එකෙන් මැකීම ---
  const handleDeleteDriver = async (id) => {
    if (window.confirm('Are you sure you want to remove this driver?')) {
      try {
        await axios.delete(`${API_URL}/api/drivers/${id}`);
        setDrivers(drivers.filter(driver => driver._id !== id));
        alert("Driver deleted!");
      } catch (err) {
        console.error("Delete error:", err);
        alert("Could not delete driver from database.");
      }
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const nameStr = driver.name?.toLowerCase() || '';
    const idStr = driver.idNumber?.toLowerCase() || '';
    const phoneStr = driver.phone || '';

    const matchesSearch =
      nameStr.includes(searchTerm.toLowerCase()) ||
      idStr.includes(searchTerm.toLowerCase()) ||
      phoneStr.includes(searchTerm);

    const matchesStatus = filterStatus === 'All' || driver.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'On Leave': return 'status-leave';
      case 'Training': return 'status-training';
      case 'Inactive': return 'status-inactive';
      default: return '';
    }
  };

  return (
    <div className="drivers-page">
      {/* Navigation Header */}
      <div className="navigation-header">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>👨‍✈️ Driver Management</h1>
      </div>

      {/* Main Header */}
      <header className="drivers-header">
        <h1>Driver Fleet</h1>
        <p>Manage and monitor your professional driving staff</p>
      </header>

      {/* Controls: Search & Filter */}
      <div className="drivers-controls">
        <div className="search-filter">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, ID or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-box">
            <label>Filter:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All Drivers</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Training">Training</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <button className="add-driver-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕ Cancel' : '+ Add New Driver'}
        </button>
      </div>

      {/* Add Driver Form */}
      {showAddForm && (
        <div className="add-driver-form">
          <h2>Register New Driver</h2>
          <form onSubmit={handleAddDriver}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" name="name" value={newDriver.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>ID Number *</label>
                <input type="text" name="idNumber" value={newDriver.idNumber} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="text" name="phone" value={newDriver.phone} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Home Town</label>
                <input type="text" name="homeTown" value={newDriver.homeTown} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={newDriver.status} onChange={handleInputChange}>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Training">Training</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Address</label>
                <input type="text" name="address" value={newDriver.address} onChange={handleInputChange} />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="add-driver-btn">Register Driver</button>
            </div>
          </form>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="driver-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Drivers</h3>
            <p>{drivers.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Active Now</h3>
            <p>{drivers.filter(d => d.status === 'Active').length}</p>
          </div>
        </div>
      </div>

      {/* Drivers Display List */}
      <div className="drivers-list">
        <h2>Driver Directory</h2>
        {filteredDrivers.length === 0 ? (
          <p>No drivers found matching your criteria.</p>
        ) : (
          <div className="driver-cards">
            {filteredDrivers.map(driver => (
              <div key={driver._id} className="driver-card">
                <div className="driver-card-header">
                  <div className="driver-avatar">{driver.name?.charAt(0)}</div>
                  <div className="driver-info">
                    <h3>{driver.name}</h3>
                    <span className={`driver-status ${getStatusColor(driver.status)}`}>{driver.status}</span>
                  </div>
                  <button className="delete-btn" onClick={() => handleDeleteDriver(driver._id)} title="Delete Driver">
                    ❌
                  </button>
                </div>

                <div className="driver-card-body">
                  <div className="driver-detail">
                    <span className="detail-label">ID Number:</span>
                    <span className="detail-value">{driver.idNumber}</span>
                  </div>
                  <div className="driver-detail">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{driver.phone}</span>
                  </div>
                  <div className="driver-detail">
                    <span className="detail-label">Home Town:</span>
                    <span className="detail-value">{driver.homeTown}</span>
                  </div>
                </div>

                <div className="driver-card-footer">
                  <button className="edit-btn">Edit Details</button>
                  <button className="schedule-btn">View Schedule</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drivers;