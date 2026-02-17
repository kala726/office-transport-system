import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Drivers.css';

const Drivers = () => {
  const navigate = useNavigate();
  
  const [drivers, setDrivers] = useState([
   
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [newDriver, setNewDriver] = useState({
    name: '',
  
    phone: '',
    idNumber: '',
    homeTown: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDriver({
      ...newDriver,
      [name]: value
    });
  };

  const handleAddDriver = (e) => {
    e.preventDefault();
    
    const driverToAdd = {
      id: drivers.length + 1,
      ...newDriver,
      experience: parseInt(newDriver.experience)
    };

    setDrivers([...drivers, driverToAdd]);
    setShowAddForm(false);
    
    setNewDriver({
      name: '',
    
    phone: '',
    idNumber: '',
    homeTown: ''
    });

    alert('Driver added successfully!');
  };

  const handleDeleteDriver = (id) => {
    if (window.confirm('Are you sure you want to remove this driver?')) {
      setDrivers(drivers.filter(driver => driver.id !== id));
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.vehicleAssigned.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || driver.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'status-active';
      case 'On Leave': return 'status-leave';
      case 'Training': return 'status-training';
      case 'Inactive': return 'status-inactive';
      default: return '';
    }
  };

  return (
    <div className="drivers-page">
      {/* Back to Home Button */}
      <div className="navigation-header">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>👨‍✈️ Driver Management</h1>
      </div>

      {/* Header */}
      <div className="drivers-header">
        <h1>Driver Management</h1>
        <p>Manage and view all registered drivers</p>
      </div>

      {/* Controls Section */}
      <div className="drivers-controls">
        <div className="search-filter">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, license, vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="filter-box">
            <label>Filter by Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Drivers</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Training">Training</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <button 
          className="add-driver-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
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
                <input
                  type="text"
                  name="name"
                  value={newDriver.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter driver's full name"
                />
              </div>

               <div className="form-group">
                <label>ID Number *</label>
                <input
                  type="text"
                  name="idNumber"
                  value={newDriver.idNumber}
                  onChange={handleInputChange}
                  placeholder="Enter ID Number"
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  value={newDriver.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+94 77 123 4567"
                />
              </div>

             

              <div className="form-group">
                <label>Home Town *</label>
                <input
                  type="text"
                  name="homeTown"
                  value={newDriver.homeTown}
                  onChange={handleInputChange}
                  placeholder="Enter home town"
                />
              </div>

              

              

              

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={newDriver.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Training">Training</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={newDriver.address}
                  onChange={handleInputChange}
                  placeholder="Driver's address"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">Register Driver</button>
              <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Driver Statistics */}
      <div className="driver-stats">
        <div className="stat-card">
          <span className="stat-icon">👨‍✈️</span>
          <div className="stat-info">
            <h3>Total Drivers</h3>
            <p>{drivers.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <h3>Active</h3>
            <p>{drivers.filter(d => d.status === 'Active').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏖️</span>
          <div className="stat-info">
            <h3>On Leave</h3>
            <p>{drivers.filter(d => d.status === 'On Leave').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📚</span>
          <div className="stat-info">
            <h3>In Training</h3>
            <p>{drivers.filter(d => d.status === 'Training').length}</p>
          </div>
        </div>
      </div>

      {/* Drivers List */}
      <div className="drivers-list">
        <h2>Registered Drivers</h2>
        {filteredDrivers.length === 0 ? (
          <div className="no-results">
            <p>No drivers found</p>
          </div>
        ) : (
          <div className="driver-cards">
            {filteredDrivers.map(driver => (
              <div key={driver.id} className="driver-card">
                <div className="driver-card-header">
                  <div className="driver-avatar">
                    {driver.name.charAt(0)}
                  </div>
                  <div className="driver-info">
                    <h3>{driver.name}</h3>
                    <span className={`driver-status ${getStatusColor(driver.status)}`}>
                      {driver.status}
                    </span>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteDriver(driver.id)}
                  >
                    🗑️
                  </button>
                </div>

                <div className="driver-card-body">
                  
                  <div className="driver-detail">
                    <span className="detail-label">IDNumber:</span>
                    <span className="detail-value">{driver.idNumber}</span>
                  </div>
                  
                  
                  <div className="driver-detail">
                    <span className="detail-label">Home Town:</span>
                    <span className="detail-value">{driver.homeTown || 'N/A'}</span>
                  </div>
                </div>

                <div className="driver-card-footer">
                  <button className="edit-btn">Edit Details</button>
                  {/* <button className="schedule-btn">View Schedule</button> */}
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