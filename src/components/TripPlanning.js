import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TripPlanning.css';

const TripPlanning = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

  // Data States
  const [members, setMembers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  // Selection States
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [driverSearchTerm, setDriverSearchTerm] = useState('');
  const [vehicleSearchTerm, setVehicleSearchTerm] = useState('');
  
  // Trip Details for Print & Planning
  const [tripDistrict, setTripDistrict] = useState('');
  const [tripTown, setTripTown] = useState('');
  const [tripDate, setTripDate] = useState('');
  
  const [tripPlanned, setTripPlanned] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, dRes, vRes] = await Promise.all([
          axios.get(`${API_URL}/api/members`),
          axios.get(`${API_URL}/api/drivers`),
          axios.get(`${API_URL}/api/vehicles`)
        ]);
        setMembers(mRes.data.data || mRes.data);
        setDrivers(dRes.data.data || dRes.data);
        setVehicles(vRes.data.data || vRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const filteredMembers = (members || []).filter(m => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (m.name || "").toLowerCase().includes(searchLower) ||
      (m.memberId || "").toLowerCase().includes(searchLower) ||
      (m.district || "").toLowerCase().includes(searchLower) ||
      (m.address || "").toLowerCase().includes(searchLower) ||
      (m.nearTown || "").toLowerCase().includes(searchLower);
    return matchesSearch;
  });

  const availableTowns = tripDistrict
    ? [...new Set(members.filter(m => m.district === tripDistrict && m.nearTown).map(m => m.nearTown))]
    : [];

  const filteredDrivers = (drivers || []).filter(d =>
    (d.name || "").toLowerCase().includes(driverSearchTerm.toLowerCase()) ||
    (d.phone || "").toLowerCase().includes(driverSearchTerm.toLowerCase())
  );

  const filteredVehicles = (vehicles || []).filter(v =>
    (v.registrationNo || "").toLowerCase().includes(vehicleSearchTerm.toLowerCase()) ||
    (v.capacity?.toString() || "").includes(vehicleSearchTerm)
  );

  const handleMemberSelect = (member) => {
    const isSelected = selectedMembers.find(m => m._id === member._id);
    if (isSelected) {
      setSelectedMembers(selectedMembers.filter(m => m._id !== member._id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  // Reset Function
  const handleReset = () => {
    setSelectedMembers([]);
    setSelectedDriver(null);
    setSelectedVehicle(null);
    setSearchTerm('');
    setDriverSearchTerm('');
    setVehicleSearchTerm('');
    setTripDistrict('');
    setTripTown('');
    setTripDate('');
    setTripPlanned(false);
  };

  const isCapacityFull = selectedVehicle && selectedMembers.length > selectedVehicle.capacity;

  return (
    <div className="trip-planning-page">
      <div className="navigation-header no-print">
        <button className="back-home-btn" onClick={() => navigate('/')}>← Home</button>
        <h1>🚌 Trip Planning System</h1>
      </div>

      <div className="trip-layout no-print">
        {/* Left Side: Members Selection Table */}
        <div className="members-table-section">
          <div className="section-header">
            <h2>Select Members</h2>
            <span className="member-count">{selectedMembers.length} Selected</span>
          </div>

          <div className="table-filters" style={{ flexDirection: 'column', gap: '10px' }}>
            <div className="search-box" style={{ width: '100%' }}>
              <input
                type="text"
                placeholder="🔍 Search name, ID, address, town or district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            
            <div className="trip-details-filters" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <div className="filter-controls" style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Trip Date</label>
                <input 
                  type="date" 
                  value={tripDate} 
                  onChange={(e) => setTripDate(e.target.value)} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div className="filter-controls" style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Destination District</label>
                <select 
                  value={tripDistrict} 
                  onChange={(e) => {
                    setTripDistrict(e.target.value);
                    setTripTown(''); // Reset town when district changes
                  }}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="">Select District</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Gampaha">Gampaha</option>
                  <option value="Kalutara">Kalutara</option>
                  {[...new Set(members.map(m => m.district).filter(d => !['Colombo', 'Gampaha', 'Kalutara'].includes(d) && d))].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="filter-controls" style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' }}>Destination Town</label>
                <select 
                  value={tripTown} 
                  onChange={(e) => setTripTown(e.target.value)}
                  disabled={!tripDistrict}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="">Select Town</option>
                  {availableTowns.map(town => (
                    <option key={town} value={town}>{town}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="members-table-container">
            <table className="members-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(m => (
                  <tr
                    key={m._id}
                    className={selectedMembers.find(sm => sm._id === m._id) ? 'selected-row' : ''}
                    onClick={() => handleMemberSelect(m)}
                  >
                    <td><input type="checkbox" checked={!!selectedMembers.find(sm => sm._id === m._id)} readOnly /></td>
                    <td>{m.memberId || m.idNumber || '-'}</td>
                    <td className="member-name">{m.name || '-'}</td>
                    <td>{[m.address, m.nearTown, m.district].filter(Boolean).join(', ') || '-'}</td>
                    <td>{m.phone || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Driver, Vehicle & Summary */}
        <div className="selection-summary-section">
          <div className="summary-card">
            <h3>👨‍✈️ Driver: {selectedDriver?.name || 'None'}</h3>
            <div className="small-search-container">
              <input
                type="text"
                placeholder="🔍 Search Driver..."
                value={driverSearchTerm}
                onChange={(e) => setDriverSearchTerm(e.target.value)}
                className="small-search-bar"
              />
            </div>
            <div className="drivers-list">
              {filteredDrivers.map(d => (
                <div
                  key={d._id}
                  className={`driver-item ${selectedDriver?._id === d._id ? 'selected' : ''}`}
                  onClick={() => setSelectedDriver(d)}
                >
                  <div className="driver-avatar">{d.name[0]}</div>
                  <div className="driver-details">
                    <strong>{d.name}</strong>
                    <span>{d.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="summary-card">
            <h3>🚗 Vehicle: {selectedVehicle?.registrationNo || 'None'}</h3>
            <div className="small-search-container">
              <input
                type="text"
                placeholder="🔍 Search Vehicle..."
                value={vehicleSearchTerm}
                onChange={(e) => setVehicleSearchTerm(e.target.value)}
                className="small-search-bar"
              />
            </div>
            <div className="vehicles-list">
              {filteredVehicles.map(v => (
                <div
                  key={v._id}
                  className={`vehicle-item ${selectedVehicle?._id === v._id ? 'selected' : ''}`}
                  onClick={() => setSelectedVehicle(v)}
                >
                  <div className="vehicle-icon">🚐</div>
                  <div className="vehicle-details">
                    <strong>{v.registrationNo}</strong>
                    <span>Capacity: {v.capacity} Seats</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`capacity-status ${isCapacityFull ? 'error' : 'success'}`}>
            Selected: {selectedMembers.length}
            {selectedVehicle && ` / Max: ${selectedVehicle.capacity}`}
            {isCapacityFull && <div className="error-msg">⚠️ Capacity Exceeded!</div>}
          </div>

          <div className="action-buttons">
            <button
              className="plan-btn"
              disabled={selectedMembers.length === 0 || !selectedDriver || !selectedVehicle || isCapacityFull}
              onClick={() => setTripPlanned(true)}
            >
              Generate Trip Plan
            </button>
            <button className="reset-btn" onClick={handleReset}>Reset All</button>
          </div>
        </div>
      </div>

      {/* Report Preview Section */}
      {tripPlanned && (
        <div className="print-section shadow" id="printReport">
          <div className="section-header no-print">
            <h2>OFFICE TRANSPORT REPORT</h2>
            <button className="print-btn" onClick={() => window.print()}>🖨️ Print PDF</button>
          </div>

          <div className="print-header">
            <div className="print-box">
              <h3>Trip Schedule</h3>
              <p><strong>Date:</strong> {tripDate || 'Not specified'}</p>
            </div>
            <div className="print-box" style={{ textAlign: 'center' }}>
              <h3>Trip Location</h3>
              <p><strong>Destination:</strong> {
                tripTown && tripDistrict ? `${tripTown}, ${tripDistrict}` : 
                tripDistrict ? tripDistrict : 
                tripTown ? tripTown : 'Not specified'
              }</p>
            </div>
            <div className="print-box" style={{ textAlign: 'right' }}>
              <h3>Driver & Vehicle Details</h3>
              <p><strong>Driver:</strong> {selectedDriver?.name} ({selectedDriver?.phone})</p>
              <p><strong>Vehicle:</strong> {selectedVehicle?.type || 'Vehicle'} - {selectedVehicle?.registrationNo}</p>
            </div>
          </div>

          <table className="print-table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {selectedMembers.map((m) => (
                <tr key={m._id}>
                  <td>{m.memberId}</td>
                  <td>{m.name}</td>
                  <td>{[m.address, m.nearTown, m.district].filter(Boolean).join(', ') || '-'}</td>
                  <td>{m.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- Signature Sections (Only Visible in Print) --- */}
          {/* <div className="only-for-print">
            <div className="signature-container-print">
              <div className="sig-row">
                <p className="sig-title">B කොටස (වාහන ඉල්ලුම් කරන අංශයේ නිලධාරීන් විසින් සම්පූර්ණ කිරීම සඳහා)</p>
                <p>ඉහත රාජකාරිය ඔහු/ඇය වෙත පවරා ඇති බැවින් ඒ සඳහා ගමන් කිරීමට වාහනයක් ලබා දීම නිර්දේශ කරමි / නොකරමි.</p>
                <div className="sig-flex-row">
                  <span>දිනය: 2026 / ...... / ......</span>
                  <div className="sig-label-box">
                    <span>......................................................</span>
                    <span>අංශ භාර මා.නි. අත්සන</span>
                  </div>
                </div>
              </div>

              <div className="print-separator"></div>

              <div className="sig-row">
                <p className="sig-title">C කොටස (ප්‍රවාහන අංශය භාර නිලධාරී හෝ අධ්‍යක්ෂ විසින් සම්පූර්ණ කිරීම සඳහා)</p>
                <p>ඉහත රාජකාරිය සඳහා වාහනයක් ලබා දීම අනුමත කරමි / නොකරමි.</p>
                <div className="sig-flex-row">
                  <span>දිනය: 2026 / ...... / ......</span>
                  <div className="sig-label-box">
                    <span>......................................................</span>
                    <span>අත්සන (අධ්‍යක්ෂ / නියෝජ්‍ය අධ්‍යක්ෂ)</span>
                  </div>
                </div>
              </div>

              <div className="print-separator"></div>

              <div className="sig-row">
                <p className="sig-title">D කොටස (ප්‍රවාහන විෂය භාර නිලධාරී විසින් සම්පූර්ණ කිරීම සඳහා)</p>
                <div className="vehicle-details-summary">
                  <span>වෙන් කරන ලද වාහනයේ අංකය: <strong>{selectedVehicle?.registrationNo}</strong></span>
                  <span>රියදුරු නම: <strong>{selectedDriver?.name}</strong></span>
                </div>
                <div className="sig-flex-row" style={{ marginTop: '20px' }}>
                  <span>දිනය: {new Date().toLocaleDateString()}</span>
                  <div className="sig-label-box">
                    <span>......................................................</span>
                    <span>ප්‍රවාහන විෂය භාර නිලධාරී</span>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default TripPlanning;