import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Members.css';

const Members = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // States
  const [members, setMembers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const initialMemberState = {
    memberId: '',
    idNumber: '',
    name: '',
    district: '',
    nearTown: '',
    address: '',
    phone: '',
    status: 'Active'
  };

  const [newMember, setNewMember] = useState(initialMemberState);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/members`);
      setMembers(res.data.data || res.data); // Ensure we get the array
    } catch (err) {
      console.error("දත්ත ලබා ගැනීමේ දෝෂයක්:", err);
    }
  };

  const sriLankanDistricts = [
    'All', 'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
    'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy',
    'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara',
    'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam',
    'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const getNextId = () => {
    if (!members || members.length === 0) return 'EMP001';
    const lastId = members[members.length - 1].memberId || "EMP000";
    const numericPart = parseInt(lastId.replace('EMP', ''));
    return `EMP${(numericPart + 1).toString().padStart(3, '0')}`;
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const memberData = { ...newMember, memberId: getNextId() };
    try {
      const res = await axios.post(`${API_URL}/api/members/add`, memberData);
      const addedMember = res.data.data || res.data;
      setMembers([...(Array.isArray(members) ? members : []), addedMember]);
      setShowAddForm(false);
      setNewMember(initialMemberState);
      alert('Member registered successfully!');
    } catch (err) {
      console.error("Save error:", err);
      alert('Failed to save to database.');
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await axios.delete(`${API_URL}/api/members/${id}`);
        setMembers(members.filter(m => m._id !== id));
        alert("Member deleted!");
      } catch (err) {
        console.error("Delete error:", err);
        alert("Could not delete from database.");
      }
    }
  };

  const filteredMembers = (members || []).filter(member => {
    const name = member.name || "";
    const mId = member.memberId || "";
    const town = member.nearTown || "";
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = name.toLowerCase().includes(searchLower) ||
      mId.toLowerCase().includes(searchLower) ||
      town.toLowerCase().includes(searchLower);

    const matchesDistrict = filterDistrict === 'All' || member.district === filterDistrict;
    const matchesStatus = filterStatus === 'All' || member.status === filterStatus;

    return matchesSearch && matchesDistrict && matchesStatus;
  });

  return (
    <div className="members-page">
      {/* Navigation Header */}
      <div className="navigation-header">
        <button className="back-home-btn" onClick={() => navigate('/')}>← Back to Home</button>
        <h1>👥 Member Management</h1>
      </div>

      {/* Blue Gradient Header */}
      <header className="members-header">
        <h1>Office Community</h1>
        <p>Manage employee transportation profiles and routes</p>
      </header>

      {/* Controls */}
      <div className="members-controls">
        <div className="search-filter">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, ID or town..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <div className="filter-box">
              <label>District:</label>
              <select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)}>
                {sriLankanDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="filter-box">
              <label>Status:</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <button className="add-member-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕ Close Form' : '+ Register Member'}
        </button>
      </div>

      {/* Registration Form */}
      {showAddForm && (
        <div className="add-member-form">
          <h2>New Member Registration</h2>
          <form onSubmit={handleAddMember}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" placeholder="Enter name" onChange={handleInputChange} value={newMember.name} required />
              </div>
              <div className="form-group">
                <label>ID Number</label>
                <input name="idNumber" placeholder="NIC Number" onChange={handleInputChange} value={newMember.idNumber} />
              </div>
              <div className="form-group">
                <label>District</label>
                <select name="district" onChange={handleInputChange} value={newMember.district} required>
                  <option value="">Select District</option>
                  {sriLankanDistricts.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Near Town</label>
                <input name="nearTown" placeholder="Nearest Town" onChange={handleInputChange} value={newMember.nearTown} required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input name="address" placeholder="Home Address" onChange={handleInputChange} value={newMember.address} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input name="phone" placeholder="07x xxxxxxx" onChange={handleInputChange} value={newMember.phone} required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" onChange={handleInputChange} value={newMember.status}>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="form-group">
                <label>Next ID (Auto)</label>
                <input className="readonly-field" value={getNextId()} readOnly />
              </div>
            </div>
            <button type="submit" className="add-member-btn">Save Member Details</button>
          </form>
        </div>
      )}

      {/* Stats Cards */}
      <div className="member-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Members</h3>
            <p>{members.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Active</h3>
            <p>{members.filter(m => m.status === 'Active').length}</p>
          </div>
        </div>
      </div>

      {/* Member Directory */}
      <div className="members-list">
        <h2>Member Directory</h2>
        {filteredMembers.length === 0 ? (
          <p className="no-results">No members found matching your search.</p>
        ) : (
          <div className="member-cards">
            {filteredMembers.map(member => (
              <div key={member._id} className="member-card">
                <div className="member-card-header">
                  <div className="member-avatar">{(member.name || "M")[0]}</div>
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    <span className="member-id">{member.memberId}</span>
                    <span className={`member-status status-${(member.status || "Active").toLowerCase()}`}>
                      {member.status}
                    </span>
                  </div>
                  <button className="delete-btn" onClick={() => handleDeleteMember(member._id)}>❌</button>
                </div>
                <div className="member-card-body">
                  <div className="member-detail">
                    <span className="detail-label">📍 Location:</span>
                    <span className="detail-value">{member.nearTown}, {member.district}</span>
                  </div>
                  <div className="member-detail">
                    <span className="detail-label">🏠 Address:</span>
                    <span className="detail-value">{member.address || 'N/A'}</span>
                  </div>
                  <div className="member-detail">
                    <span className="detail-label">📞 Contact:</span>
                    <span className="detail-value">{member.phone}</span>
                  </div>
                  <div className="member-detail">
                    <span className="detail-label">🆔 ID Card:</span>
                    <span className="detail-value">{member.idNumber || 'N/A'}</span>
                  </div>
                </div>
                <div className="member-card-footer">
                  <button className="edit-btn">Edit</button>
                  <button className="schedule-btn">History</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;