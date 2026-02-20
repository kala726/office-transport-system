import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Members.css';

const Members = () => {
  const navigate = useNavigate();

  const [members, setMembers] = useState([
    {
      id: 1,
      memberId: 'EMP001',
      name: 'Amara Perera',
      district: 'Colombo',
      nearTown: 'Nugegoda',
      phone: '0712345678',
      idNumber: '901234567V',
      status: 'Active'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const initialMemberState = {
    memberId: '',
    idNumber: '', // මෙතැනට අලුතින් එක් කළා
    name: '',
    district: '',
    nearTown: '',
    phone: '',
    status: 'Active'
  };

  const [newMember, setNewMember] = useState(initialMemberState);

  const sriLankanDistricts = [
    'All', 'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
    'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy',
    'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara',
    'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam',
    'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  const statuses = ['Active', 'On Leave', 'Inactive'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  // මීළඟ Member ID එක සොයා ගැනීම
  const getNextId = () => {
    if (members.length === 0) return 'EMP001';
    const lastId = members[members.length - 1].memberId;
    const numericPart = parseInt(lastId.replace('EMP', ''));
    return `EMP${(numericPart + 1).toString().padStart(3, '0')}`;
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    const memberToAdd = {
      id: Date.now(),
      ...newMember,
      memberId: getNextId() // Submit කරන වෙලාවේදී අලුත්ම ID එක ලබා දීම
    };

    setMembers([...members, memberToAdd]);
    setShowAddForm(false);
    setNewMember(initialMemberState);
    alert('Member registered successfully!');
  };

  const handleDeleteMember = (id) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const filteredMembers = members.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      member.name.toLowerCase().includes(searchLower) ||
      member.memberId.toLowerCase().includes(searchLower) ||
      member.nearTown.toLowerCase().includes(searchLower);

    const matchesDistrict = filterDistrict === 'All' || member.district === filterDistrict;
    const matchesStatus = filterStatus === 'All' || member.status === filterStatus;

    return matchesSearch && matchesDistrict && matchesStatus;
  });

  return (
    <div className="members-page">
      <div className="navigation-header">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>👥 Member Management</h1>
      </div>

      <div className="members-controls">
        <div className="search-filter">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, ID or town..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="filter-group">
            <select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)}>
              {sriLankanDistricts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All Status</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕ Close' : '+ Register Member'}
        </button>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="add-member-form">
            <h2>New Registration</h2>
            <form onSubmit={handleAddMember}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input name="name" value={newMember.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>ID Number</label>
                  <input name="idNumber" value={newMember.idNumber} onChange={handleInputChange} placeholder="95xxxxxxxV" />
                </div>
                <div className="form-group">
                  <label>District *</label>
                  <select name="district" value={newMember.district} onChange={handleInputChange} required>
                    <option value="">Select</option>
                    {sriLankanDistricts.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Near Town *</label>
                  <input name="nearTown" value={newMember.nearTown} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input name="phone" value={newMember.phone} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="member-cards-container">
        {filteredMembers.map(member => (
          <div key={member.id} className="member-card">
            <div className={`status-badge ${member.status.toLowerCase()}`}>{member.status}</div>
            <div className="card-header">
              <div className="avatar">{member.name[0]}</div>
              <div className="header-text">
                <h3>{member.name}</h3>
                <span>{member.memberId}</span>
              </div>
            </div>
            <div className="card-content">
              <p>📍 {member.nearTown}, {member.district}</p>
              <p>📞 {member.phone}</p>
            </div>
            <div className="card-footer">
              <button onClick={() => handleDeleteMember(member.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Members;