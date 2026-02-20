import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Drivers.css';

const Drivers = () => {
  const navigate = useNavigate();

  // මුල් දත්ත කිහිපයක් ඇතුළත් කිරීම (Sample Data)
  const [drivers, setDrivers] = useState([

  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Initial state එකේ සියලුම fields ඇතුළත් කළා
  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    idNumber: '',
    homeTown: '',
    status: 'Active',
    address: ''
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
      id: Date.now(), // වඩාත් ආරක්ෂිත ID එකක් සඳහා
      ...newDriver
    };

    setDrivers([...drivers, driverToAdd]);
    setShowAddForm(false);

    // Form එක reset කිරීම
    setNewDriver({
      name: '',
      phone: '',
      idNumber: '',
      homeTown: '',
      status: 'Active',
      address: ''
    });

    alert('Driver added successfully!');
  };

  const handleDeleteDriver = (id) => {
    if (window.confirm('Are you sure you want to remove this driver?')) {
      setDrivers(drivers.filter(driver => driver.id !== id));
    }
  };

  // Search logic එකේ undefined errors මගහරවා ගැනීම
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
      <div className="navigation-header">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>👨‍✈️ Driver Management</h1>
      </div>

      <div className="drivers-controls">
        <div className="search-filter">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, ID or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-box">
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
              <button type="submit" className="submit-btn">Register Driver</button>
            </div>
          </form>
        </div>
      )}

      {/* Statistics Section */}
      <div className="driver-stats">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{drivers.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active</h3>
          <p>{drivers.filter(d => d.status === 'Active').length}</p>
        </div>
      </div>

      {/* Driver List Section */}
      <div className="drivers-list">
        {filteredDrivers.length === 0 ? (
          <p>No drivers found</p>
        ) : (
          <div className="driver-cards">
            {filteredDrivers.map(driver => (
              <div key={driver.id} className="driver-card">
                <div className="driver-card-header">
                  <div className="driver-avatar">{driver.name.charAt(0)}</div>
                  <div className="driver-info">
                    <h3>{driver.name}</h3>
                    <span className={`driver-status ${getStatusColor(driver.status)}`}>{driver.status}</span>
                  </div>
                  <button className="delete-btn" onClick={() => handleDeleteDriver(driver.id)}>🗑️</button>
                </div>
                <div className="driver-card-body">
                  <p><strong>ID:</strong> {driver.idNumber}</p>
                  <p><strong>Phone:</strong> {driver.phone}</p>
                  <p><strong>Home:</strong> {driver.homeTown}</p>
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