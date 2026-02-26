import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Vehicles.css';

const Vehicles = () => {
  const navigate = useNavigate();

  // States
  const [vehicles, setVehicles] = useState([]);
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
    fuelType: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

  // Fetch Data
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/vehicles`);
        setVehicles(res.data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    };
    fetchVehicles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/vehicles/add`, {
        ...newVehicle,
        capacity: parseInt(newVehicle.capacity)
      });
      setVehicles([...vehicles, res.data]);
      setShowAddForm(false);
      setNewVehicle({ registrationNo: '', type: '', model: '', capacity: '', driver: '', status: 'Active', fuelType: '' });
      alert('Vehicle registered successfully!');
    } catch (err) {
      alert('Failed to save vehicle. Is the backend running?');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm('Are you sure you want to remove this vehicle?')) {
      try {
        await axios.delete(`${API_URL}/api/vehicles/${id}`);
        setVehicles(vehicles.filter(v => v._id !== id));
      } catch (err) {
        alert("Could not delete from database.");
      }
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.registrationNo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || v.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="vehicles-page">
      <div className="navigation-header">
        <button className="back-home-btn" onClick={() => navigate('/')}>← Home</button>
        <div className="title-section">
          <h1>🚛 Vehicle Fleet Management</h1>
          <p>Tracking {vehicles.length} vehicles in your fleet</p>
        </div>
      </div>

      <div className="vehicle-stats">
        <div className="stat-card">
          <div className="stat-icon">🚐</div>
          <div className="stat-info">
            <h3>Total Fleet</h3>
            <p>{vehicles.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#28a745' }}>✅</div>
          <div className="stat-info">
            <h3>Active</h3>
            <p>{vehicles.filter(v => v.status === 'Active').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#ffc107' }}>🛠️</div>
          <div className="stat-info">
            <h3>Maintenance</h3>
            <p>{vehicles.filter(v => v.status === 'Maintenance').length}</p>
          </div>
        </div>
      </div>

      <div className="vehicles-controls">
        <div className="search-filter">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search Reg No (e.g. NB-1234)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Bus">Buses</option>
              <option value="Van">Vans</option>
              <option value="Car">Cars</option>
            </select>
          </div>
        </div>
        <button className="add-vehicle-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : '+ Add New Vehicle'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-vehicle-form">
          <h2>Register New Vehicle</h2>
          <form onSubmit={handleAddVehicle}>
            <div className="form-grid">
              <div className="form-group">
                <label>Registration No</label>
                <input name="registrationNo" placeholder="WP NB-1234" onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Vehicle Type</label>
                <select name="type" onChange={handleInputChange} required>
                  <option value="">Select</option>
                  <option value="Bus">Bus</option>
                  <option value="Van">Van</option>
                  <option value="Car">Car</option>
                </select>
              </div>
              <div className="form-group">
                <label>Model</label>
                <input name="model" placeholder="Toyota Hiace" onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Capacity (Seats)</label>
                <input name="capacity" type="number" onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Assigned Driver</label>
                <input name="driver" placeholder="Driver Name" onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Fuel Type</label>
                <select name="fuelType" onChange={handleInputChange} required>
                  <option value="">Select</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">Save Vehicle</button>
              <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="vehicle-cards">
        {filteredVehicles.map(v => (
          <div key={v._id} className="vehicle-card">
            <div className="vehicle-card-header">
              <div className="vehicle-type-icon">{v.type === 'Bus' ? '🚌' : v.type === 'Van' ? '🚐' : '🚗'}</div>
              <div className="vehicle-registration">
                <h3>{v.registrationNo}</h3>
                <span className={`vehicle-status status-${(v.status || 'Active').toLowerCase()}`}>
                  {v.status || 'Active'}
                </span>
              </div>
              <button className="delete-btn" onClick={() => handleDeleteVehicle(v._id)}>❌</button>
            </div>
            <div className="vehicle-card-body">
              <div className="vehicle-detail">
                <span className="detail-label">Model:</span>
                <span className="detail-value">{v.model}</span>
              </div>
              <div className="vehicle-detail">
                <span className="detail-label">Capacity:</span>
                <span className="detail-value">{v.capacity} Seats</span>
              </div>
              <div className="vehicle-detail">
                <span className="detail-label">Fuel:</span>
                <span className="detail-value">{v.fuelType}</span>
              </div>
              <div className="vehicle-detail">
                <span className="detail-label">Driver:</span>
                <span className="detail-value">{v.driver || 'Not Assigned'}</span>
              </div>
            </div>
            <div className="vehicle-card-footer">
              <button className="edit-btn">Edit Details</button>
              <button className="schedule-btn">Maintenance</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;