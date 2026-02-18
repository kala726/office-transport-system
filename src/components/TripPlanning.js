import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TripPlanning.css';

const TripPlanning = () => {
  const navigate = useNavigate();

  // Sample Members Data (වැඩිපුර members)
  const [members] = useState([
    
    
  ]);

  // Sample Drivers Data
  const [drivers] = useState([
   
   
  ]);

  // Sample Vehicles Data
  const [vehicles] = useState([
  
  ]);

  // States
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // Table Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'id', 'district'
  const [sortOrder, setSortOrder] = useState('asc');
  
  const [tripPlanned, setTripPlanned] = useState(false);

  // Sri Lankan Districts
  const sriLankanDistricts = [
    'All', 'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Galle', 'Matara', 'Hambantota', 'Jaffna',
  ];

  // Filter and Sort Members
  const filteredMembers = members
    .filter(member => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.town.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm);
      
      const matchesDistrict = filterDistrict === 'All' || member.district === filterDistrict;
      
      return matchesSearch && matchesDistrict && member.status === 'Active';
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
      else if (sortBy === 'id') comparison = a.memberId.localeCompare(b.memberId);
      else if (sortBy === 'district') comparison = a.district.localeCompare(b.district);
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Handle Select All Members
  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      // If all are selected, unselect all
      setSelectedMembers([]);
    } else {
      // Select all filtered members
      setSelectedMembers(filteredMembers);
    }
  };

  // Handle Individual Member Select
  const handleMemberSelect = (member) => {
    const isSelected = selectedMembers.find(m => m.id === member.id);
    
    if (isSelected) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  // Handle Member Remove from Selected List
  const handleMemberRemove = (id) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== id));
  };

  // Handle Driver Select
  const handleDriverSelect = (driver) => {
    if (selectedDriver?.id === driver.id) {
      setSelectedDriver(null);
    } else {
      setSelectedDriver(driver);
    }
  };

  // Handle Vehicle Select
  const handleVehicleSelect = (vehicle) => {
    if (selectedVehicle?.id === vehicle.id) {
      setSelectedVehicle(null);
    } else {
      setSelectedVehicle(vehicle);
    }
  };

  // Handle Plan Trip
  const handlePlanTrip = () => {
    if (selectedMembers.length === 0) {
      alert('Please select at least one member');
      return;
    }
    if (!selectedDriver) {
      alert('Please select a driver');
      return;
    }
    if (!selectedVehicle) {
      alert('Please select a vehicle');
      return;
    }

    // Check capacity
    if (selectedMembers.length > selectedVehicle.capacity) {
      alert(`Vehicle capacity exceeded! Max ${selectedVehicle.capacity} seats`);
      return;
    }

    setTripPlanned(true);
  };

  // Handle Reset
  const handleReset = () => {
    setSelectedMembers([]);
    setSelectedDriver(null);
    setSelectedVehicle(null);
    setTripPlanned(false);
    setSearchTerm('');
    setFilterDistrict('All');
  };

  // Handle Print
  const handlePrint = () => {
    const printContent = document.getElementById('print-area');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Trip Plan - ${selectedDriver?.name}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #4CAF50; color: white; padding: 10px; text-align: left; }
            td { border: 1px solid #000; padding: 8px; }
            .print-header { 
              display: grid; 
              grid-template-columns: repeat(3, 1fr); 
              gap: 20px; 
              margin-bottom: 20px; 
            }
            .header-box { 
              border: 1px solid #000; 
              padding: 10px; 
              background: #f0f0f0; 
            }
            @media print {
              .print-btn { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="trip-planning-page">
      {/* Back to Home */}
      <div className="navigation-header">
        <button className="back-home-btn" onClick={() => navigate('/')}>← Back to Home</button>
        <h1>🚌 Trip Planning System</h1>
      </div>

      {/* Main Layout */}
      <div className="trip-layout">
        {/* Left Side - Member Selection Table */}
        <div className="members-table-section">
          <div className="section-header">
            <h2>📍 Select Members</h2>
            <div className="member-count">
              Selected: {selectedMembers.length} / {filteredMembers.length}
            </div>
          </div>

          {/* Filters */}
          <div className="table-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Search by name, ID, town, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-controls">
              <select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)}>
                {sriLankanDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Sort by Name</option>
                <option value="id">Sort by ID</option>
                <option value="district">Sort by District</option>
              </select>

              <button 
                className="sort-order-btn"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
              </button>

              <button 
                className={`select-all-btn ${selectedMembers.length === filteredMembers.length ? 'all-selected' : ''}`}
                onClick={handleSelectAll}
              >
                {selectedMembers.length === filteredMembers.length ? 'Unselect All' : 'Select All'}
              </button>
            </div>
          </div>

          {/* Members Table */}
          <div className="members-table-container">
            <table className="members-table">
              <thead>
                <tr>
                  <th width="50px">#</th>
                  <th>Select</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Town</th>
                  <th>District</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member, index) => {
                  const isSelected = selectedMembers.find(m => m.id === member.id);
                  return (
                    <tr 
                      key={member.id} 
                      className={isSelected ? 'selected-row' : ''}
                      onClick={() => handleMemberSelect(member)}
                    >
                      <td>{index + 1}</td>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={isSelected ? true : false}
                          readOnly
                          className="member-checkbox"
                        />
                      </td>
                      <td>{member.memberId}</td>
                      <td className="member-name">{member.name}</td>
                      <td>{member.phone}</td>
                      <td>{member.town}</td>
                      <td>{member.district}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side - Selection Summary */}
        <div className="selection-summary-section">
          {/* Selected Members Summary */}
          <div className="summary-card">
            <h3>✅ Selected Members ({selectedMembers.length})</h3>
            <div className="selected-members-list">
              {selectedMembers.length > 0 ? (
                selectedMembers.map(member => (
                  <div key={member.id} className="selected-member-item">
                    <span className="member-name">{member.name}</span>
                    <span className="member-detail">{member.memberId}</span>
                    <span className="member-detail">{member.town}</span>
                    <button onClick={() => handleMemberRemove(member.id)}>✕</button>
                  </div>
                ))
              ) : (
                <p className="no-selection">No members selected</p>
              )}
            </div>
          </div>

          {/* Driver Selection */}
          <div className="summary-card">
            <h3>👨‍✈️ Select Driver</h3>
            <div className="drivers-list">
              {drivers.map(driver => (
                <div
                  key={driver.id}
                  className={`driver-item ${selectedDriver?.id === driver.id ? 'selected' : ''}`}
                  onClick={() => handleDriverSelect(driver)}
                >
                  <div className="driver-avatar">{driver.name.charAt(0)}</div>
                  <div className="driver-details">
                    <strong>{driver.name}</strong>
                    <span>📞 {driver.phone}</span>
                    <span>🎫 {driver.licenseNo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className="summary-card">
            <h3>🚗 Select Vehicle</h3>
            <div className="vehicles-list">
              {vehicles.map(vehicle => (
                <div
                  key={vehicle.id}
                  className={`vehicle-item ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  <div className="vehicle-icon">
                    {vehicle.type === 'Bus' && '🚌'}
                    {vehicle.type === 'Van' && '🚐'}
                    {vehicle.type === 'Car' && '🚗'}
                  </div>
                  <div className="vehicle-details">
                    <strong>{vehicle.registrationNo}</strong>
                    <span>{vehicle.type} - {vehicle.capacity} seats</span>
                    <span>Driver: {vehicle.driver}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capacity Status */}
          {selectedVehicle && (
            <div className={`capacity-status ${selectedMembers.length <= selectedVehicle.capacity ? 'success' : 'error'}`}>
              <strong>Seat Count:</strong> {selectedMembers.length} / {selectedVehicle.capacity}
              {selectedMembers.length > selectedVehicle.capacity && 
                <span className="error-msg"> (Not enough capacity!)</span>
              }
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="plan-btn"
              onClick={handlePlanTrip}
              disabled={!selectedDriver || !selectedVehicle || selectedMembers.length === 0}
            >
              Plan Trip
            </button>
            <button className="reset-btn" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Print Area */}
      {tripPlanned && selectedDriver && selectedVehicle && (
        <div id="print-area" className="print-section">
          <h2>📋 Transport Report</h2>

          <div className="print-header">
            <div className="print-box">
              <strong>Driver:</strong> {selectedDriver.name}<br />
              <strong>Phone:</strong> {selectedDriver.phone}
            </div>
            <div className="print-box">
              <strong>Vehicle:</strong> {selectedVehicle.registrationNo}<br />
              <strong>Type:</strong> {selectedVehicle.type} ({selectedVehicle.capacity} seats)
            </div>
            <div className="print-box">
              <strong>Total Members:</strong> {selectedMembers.length}<br />
              <strong>Date:</strong> {new Date().toLocaleDateString()}
            </div>
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Member ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {selectedMembers.map((member, index) => (
                <tr key={member.id}>
                  <td>{index + 1}</td>
                  <td>{member.memberId}</td>
                  <td>{member.name}</td>
                  <td>{member.phone}</td>
                  <td>{member.town}, {member.district}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="print-btn" onClick={handlePrint}>
            🖨️ Print 
          </button>
        </div>
      )}
    </div>
  );
};

export default TripPlanning;