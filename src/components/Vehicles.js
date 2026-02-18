import React, { useState } from 'react';
import { getVehicles, addVehicle, deleteVehicle } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Vehicles.css';

const Vehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([
    
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
    setNewVehicle({
      ...newVehicle,
      [name]: value
    });
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    
    // Create new vehicle object
    const vehicleToAdd = {
      id: vehicles.length + 1,
      ...newVehicle,
      capacity: parseInt(newVehicle.capacity)
    };

    setVehicles([...vehicles, vehicleToAdd]);
    setShowAddForm(false);
    
    // Reset form
    setNewVehicle({
      registrationNo: '',
      type: '',
      model: '',
      capacity: '',
      driver: '',
      status: 'Active',
      lastMaintenance: '',
      fuelType: ''
    });

    alert('Vehicle added successfully!');
  };

  const handleDeleteVehicle = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    }
  };

  // Filter vehicles based on search and type
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'All' || vehicle.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'status-active';
      case 'Maintenance': return 'status-maintenance';
      case 'Inactive': return 'status-inactive';
      default: return '';
    }
  };

  return (
    <div className="vehicles-page">
      <div className="navigation-header">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>Vehicle Management</h1>
      </div>
      {/* Header */}
      <div className="vehicles-header">
        <h1>🚗 Vehicle Management</h1>
        <p>Manage and view all registered vehicles</p>

        
      </div>
      

      {/* Controls Section */}
      <div className="vehicles-controls">
        <div className="search-filter">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by registration, model, or driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="filter-box">
            <label>Filter by Type:</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Vehicles</option>
              <option value="Bus">Buses</option>
              <option value="Van">Vans</option>
              <option value="Car">Cars</option>
              <option value="Truck">Trucks</option>
            </select>
          </div>
        </div>

        <button 
          className="add-vehicle-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✕ Cancel' : '+ Add New Vehicle'}
        </button>
      </div>

      {/* Add Vehicle Form */}
      {showAddForm && (
        <div className="add-vehicle-form">
          <h2>Add New Vehicle</h2>
          <form onSubmit={handleAddVehicle}>
            <div className="form-grid">
              <div className="form-group">
                <label>Registration Number *</label>
                <input
                  type="text"
                  name="registrationNo"
                  value={newVehicle.registrationNo}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., ABC-1234"
                />
              </div>

              <div className="form-group">
                <label>Vehicle Type *</label>
                <select
                  name="type"
                  value={newVehicle.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Bus">Bus</option>
                  <option value="Van">Van</option>
                  <option value="Car">Car</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>

              <div className="form-group">
                <label>Model *</label>
                <input
                  type="text"
                  name="model"
                  value={newVehicle.model}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Toyota Coaster"
                />
              </div>

              <div className="form-group">
                <label>Capacity *</label>
                <input
                  type="number"
                  name="capacity"
                  value={newVehicle.capacity}
                  onChange={handleInputChange}
                  required
                  placeholder="Number of seats"
                />
              </div>

              <div className="form-group">
                <label>Assigned Driver</label>
                <input
                  type="text"
                  name="driver"
                  value={newVehicle.driver}
                  onChange={handleInputChange}
                  placeholder="Driver name"
                />
              </div>

              <div className="form-group">
                <label>Fuel Type *</label>
                <select
                  name="fuelType"
                  value={newVehicle.fuelType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div className="form-group">
                <label>Last Maintenance Date</label>
                <input
                  type="date"
                  name="lastMaintenance"
                  value={newVehicle.lastMaintenance}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={newVehicle.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">Add Vehicle</button>
              <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicles Statistics */}
      <div className="vehicle-stats">
        <div className="stat-card">
          <span className="stat-icon">🚌</span>
          <div className="stat-info">
            <h3>Total Vehicles</h3>
            <p>{vehicles.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <h3>Active</h3>
            <p>{vehicles.filter(v => v.status === 'Active').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔧</span>
          <div className="stat-info">
            <h3>Maintenance</h3>
            <p>{vehicles.filter(v => v.status === 'Maintenance').length}</p>
          </div>
        </div>
      </div>

      {/* Vehicles List */}
      <div className="vehicles-list">
        <h2>Registered Vehicles</h2>
        {filteredVehicles.length === 0 ? (
          <div className="no-results">
            <p>No vehicles found</p>
          </div>
        ) : (
          <div className="vehicle-cards">
            {filteredVehicles.map(vehicle => (
              <div key={vehicle.id} className="vehicle-card">
                <div className="vehicle-card-header">
                  <div className="vehicle-type-icon">
                    {vehicle.type === 'Bus' && '🚌'}
                    {vehicle.type === 'Van' && '🚐'}
                    {vehicle.type === 'Car' && '🚗'}
                    {vehicle.type === 'Truck' && '🚛'}
                  </div>
                  <div className="vehicle-registration">
                    <h3>{vehicle.registrationNo}</h3>
                    <span className={`vehicle-status ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                  >
                    🗑️
                  </button>
                </div>

                <div className="vehicle-card-body">
                  <div className="vehicle-detail">
                    <span className="detail-label">Model:</span>
                    <span className="detail-value">{vehicle.model}</span>
                  </div>
                  <div className="vehicle-detail">
                    <span className="detail-label">Capacity:</span>
                    <span className="detail-value">{vehicle.capacity} seats</span>
                  </div>
                  <div className="vehicle-detail">
                    <span className="detail-label">Driver:</span>
                    <span className="detail-value">{vehicle.driver || 'Not Assigned'}</span>
                  </div>
                  <div className="vehicle-detail">
                    <span className="detail-label">Fuel Type:</span>
                    <span className="detail-value">{vehicle.fuelType}</span>
                  </div>
                  <div className="vehicle-detail">
                    <span className="detail-label">Last Maintenance:</span>
                    <span className="detail-value">{vehicle.lastMaintenance || 'Not recorded'}</span>
                  </div>
                </div>

                <div className="vehicle-card-footer">
                  <button className="edit-btn">Edit</button>
                  <button className="schedule-btn">Schedule</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;