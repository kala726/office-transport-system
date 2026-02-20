import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Vehicles.css';

const Vehicles = () => {
  const navigate = useNavigate();

  // මුලින් පෙන්වීම සඳහා නියැදි දත්ත (Sample Data)
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      registrationNo: 'WP NB-4567',
      type: 'Van',
      model: 'Toyota Hiace',
      capacity: 14,
      driver: 'Sunil Shantha',
      status: 'Active',
      lastMaintenance: '2025-12-10',
      fuelType: 'Diesel'
    },
    {
      id: 2,
      registrationNo: 'CP-8890',
      type: 'Bus',
      model: 'Mitsubishi Rosa',
      capacity: 26,
      driver: 'Nimal Perera',
      status: 'Maintenance',
      lastMaintenance: '2026-01-05',
      fuelType: 'Diesel'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const [newVehicle, setNewVehicle] = useState({
    registrationNo: '',
    type: '',
    model: '',
    capacity: '',
    driver: '',
    status: 'Active',
    lastMaintenance: '',
    fuelType: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    const vehicleToAdd = {
      id: Date.now(), // වඩාත් ආරක්ෂිත ID එකක් සඳහා
      ...newVehicle,
      capacity: parseInt(newVehicle.capacity)
    };

    setVehicles([...vehicles, vehicleToAdd]);
    setShowAddForm(false);
    setNewVehicle({ registrationNo: '', type: '', model: '', capacity: '', driver: '', status: 'Active', lastMaintenance: '', fuelType: '' });
    alert('Vehicle registered successfully!');
  };

  const handleDeleteVehicle = (id) => {
    if (window.confirm('Are you sure?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || v.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="vehicles-page">
      {/* Navigation & Title */}
      <div className="navigation-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Home</button>
        <div className="title-section">
          <h1>🚛 Vehicle Fleet Management</h1>
          <p>Tracking {vehicles.length} vehicles in your organization</p>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="stats-container">
        <div className="stat-card blue">
          <h3>{vehicles.length}</h3>
          <p>Total Fleet</p>
        </div>
        <div className="stat-card green">
          <h3>{vehicles.filter(v => v.status === 'Active').length}</h3>
          <p>Available</p>
        </div>
        <div className="stat-card orange">
          <h3>{vehicles.filter(v => v.status === 'Maintenance').length}</h3>
          <p>In Workshop</p>
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="action-bar">
        <div className="search-group">
          <input
            type="text"
            placeholder="Search Registration No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">All Types</option>
            <option value="Bus">Buses</option>
            <option value="Van">Vans</option>
            <option value="Car">Cars</option>
          </select>
        </div>
        <button className="primary-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : '+ Add Vehicle'}
        </button>
      </div>

      {/* Add Vehicle Modal/Form */}
      {showAddForm && (
        <div className="form-modal">
          <form className="animated-form" onSubmit={handleAddVehicle}>
            <h2>Register New Vehicle</h2>
            <div className="form-grid">
              <input name="registrationNo" placeholder="Reg No (e.g. WP NB-1234)" onChange={handleInputChange} required />
              <select name="type" onChange={handleInputChange} required>
                <option value="">Select Type</option>
                <option value="Bus">Bus</option>
                <option value="Van">Van</option>
                <option value="Car">Car</option>
              </select>
              <input name="model" placeholder="Model (e.g. Toyota)" onChange={handleInputChange} required />
              <input name="capacity" type="number" placeholder="Seats" onChange={handleInputChange} required />
              <input name="driver" placeholder="Assigned Driver" onChange={handleInputChange} />
              <select name="fuelType" onChange={handleInputChange} required>
                <option value="">Fuel Type</option>
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
              </select>
            </div>
            <div className="form-buttons">
              <button type="submit" className="save-btn">Save Vehicle</button>
              <button type="button" className="cancel-link" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicle Grid View */}
      <div className="vehicle-grid">
        {filteredVehicles.map(v => (
          <div key={v.id} className={`v-card ${v.status.toLowerCase()}`}>
            <div className="v-card-top">
              <span className="v-type">{v.type}</span>
              <span className={`v-status-dot ${v.status.toLowerCase()}`}></span>
            </div>
            <div className="v-card-mid">
              <h2>{v.registrationNo}</h2>
              <p><strong>{v.model}</strong></p>
              <div className="v-info-row">
                <span>👥 {v.capacity} Seats</span>
                <span>⛽ {v.fuelType}</span>
              </div>
              <p className="v-driver">👨‍✈️ {v.driver || 'No driver assigned'}</p>
            </div>
            <div className="v-card-bottom">
              <button className="del-icon-btn" onClick={() => handleDeleteVehicle(v.id)}>🗑️</button>
              <button className="edit-link">Edit Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;