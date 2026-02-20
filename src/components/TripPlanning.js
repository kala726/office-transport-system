import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TripPlanning.css';

const TripPlanning = () => {
  const navigate = useNavigate();

  // --- Sample Data (ඔබේ State එක සඳහා) ---


  // --- States ---
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [tripPlanned, setTripPlanned] = useState(false);

  // --- Logic ---
  const filteredMembers = members
    .filter(member => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.town.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDistrict = filterDistrict === 'All' || member.district === filterDistrict;
      return matchesSearch && matchesDistrict && member.status === 'Active';
    })
    .sort((a, b) => {
      let comp = a[sortBy].localeCompare(b[sortBy]);
      return sortOrder === 'asc' ? comp : -comp;
    });

  const handleMemberSelect = (member) => {
    const isAlreadySelected = selectedMembers.find(m => m.id === member.id);
    if (isAlreadySelected) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handlePlanTrip = () => {
    if (selectedMembers.length === 0) return alert('Select at least one member.');
    if (!selectedDriver || !selectedVehicle) return alert('Select both Driver and Vehicle.');
    if (selectedMembers.length > selectedVehicle.capacity) return alert('Capacity exceeded!');

    setTripPlanned(true);
  };

  return (
    <div className="trip-planning-page">
      <div className="navigation-header">
        <button className="back-home-btn" onClick={() => navigate('/')}>← Home</button>
        <h1>🚌 Trip Planning System</h1>
      </div>

      <div className="trip-layout">
        {/* Left Side: Selection Table */}
        <div className="members-table-section">
          <div className="table-filters">
            <input
              type="text"
              placeholder="🔍 Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select onChange={(e) => setFilterDistrict(e.target.value)}>
              <option value="All">All Districts</option>
              <option value="Colombo">Colombo</option>
              <option value="Gampaha">Gampaha</option>
            </select>
          </div>

          <div className="scroll-table">
            <table className="members-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Town</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(member => (
                  <tr
                    key={member.id}
                    className={selectedMembers.find(m => m.id === member.id) ? 'selected-row' : ''}
                    onClick={() => handleMemberSelect(member)}
                  >
                    <td><input type="checkbox" checked={!!selectedMembers.find(m => m.id === member.id)} readOnly /></td>
                    <td>{member.memberId}</td>
                    <td>{member.name}</td>
                    <td>{member.town}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Summary & Options */}
        <div className="selection-summary-section">
          <div className="summary-card">
            <h3>👨‍✈️ Driver: {selectedDriver ? selectedDriver.name : 'Not Selected'}</h3>
            <div className="item-grid">
              {drivers.map(d => (
                <button
                  key={d.id}
                  className={`select-item-btn ${selectedDriver?.id === d.id ? 'active' : ''}`}
                  onClick={() => setSelectedDriver(d)}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          <div className="summary-card">
            <h3>🚗 Vehicle: {selectedVehicle ? selectedVehicle.registrationNo : 'Not Selected'}</h3>
            <div className="item-grid">
              {vehicles.map(v => (
                <button
                  key={v.id}
                  className={`select-item-btn ${selectedVehicle?.id === v.id ? 'active' : ''}`}
                  onClick={() => setSelectedVehicle(v)}
                >
                  {v.registrationNo} ({v.capacity} Seats)
                </button>
              ))}
            </div>
          </div>

          <div className="final-actions">
            <div className="stats-info">
              <span>Selected: <strong>{selectedMembers.length}</strong></span>
              {selectedVehicle && (
                <span className={selectedMembers.length > selectedVehicle.capacity ? 'text-red' : 'text-green'}>
                  Capacity: {selectedVehicle.capacity}
                </span>
              )}
            </div>
            <button className="plan-btn" onClick={handlePlanTrip}>Generate Plan</button>
            <button className="reset-btn" onClick={() => window.location.reload()}>Reset</button>
          </div>
        </div>
      </div>

      {/* Print Preview Area */}
      {tripPlanned && (
        <div id="print-area" className="print-report shadow">
          <h2>OFFICE TRANSPORT REPORT</h2>
          <hr />
          <div className="report-header">
            <p><strong>Driver:</strong> {selectedDriver.name}</p>
            <p><strong>Vehicle:</strong> {selectedVehicle.registrationNo}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          </div>
          <table className="report-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Town</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {selectedMembers.map((m, i) => (
                <tr key={m.id}>
                  <td>{i + 1}</td>
                  <td>{m.name}</td>
                  <td>{m.town}</td>
                  <td>{m.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="print-btn-final" onClick={() => window.print()}>🖨️ Print PDF</button>
        </div>
      )}
    </div>
  );
};

export default TripPlanning;