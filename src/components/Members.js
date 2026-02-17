import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Members.css';

const Members = () => {
  const navigate = useNavigate();
  
  const [members, setMembers] = useState([
   
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [newMember, setNewMember] = useState({
    memberId: '',
    name: '',
    district: '',
    nearTown: '',
    phone: '',
    email: '',
    department: '',
    designation: '',
    joinDate: '',
    status: 'Active'
  });

  // Sri Lankan districts list
  const sriLankanDistricts = [
    'All', 'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 
    'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 
    'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 
    'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 
    'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Admin', 'Management'];
  const statuses = ['Active', 'On Leave', 'Inactive'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({
      ...newMember,
      [name]: value
    });
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    
    const memberToAdd = {
      id: members.length + 1,
      ...newMember
    };

    setMembers([...members, memberToAdd]);
    setShowAddForm(false);
    
    setNewMember({
      memberId: '',
      name: '',
      district: '',
      nearTown: '',
      phone: '',
      email: '',
      department: '',
      designation: '',
      joinDate: '',
      status: 'Active'
    });

    alert('Member added successfully!');
  };

  const handleDeleteMember = (id) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      setMembers(members.filter(member => member.id !== id));
    }
  };

  // Generate next Member ID
  const generateMemberId = () => {
    const lastMember = members[members.length - 1];
    if (lastMember) {
      const lastId = parseInt(lastMember.memberId.replace('EMP', ''));
      const nextId = lastId + 1;
      return `EMP${nextId.toString().padStart(3, '0')}`;
    }
    return 'EMP001';
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.nearTown.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistrict = filterDistrict === 'All' || member.district === filterDistrict;
    const matchesStatus = filterStatus === 'All' || member.status === filterStatus;
    
    return matchesSearch && matchesDistrict && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'status-active';
      case 'On Leave': return 'status-leave';
      case 'Inactive': return 'status-inactive';
      default: return '';
    }
  };

  return (
    <div className="members-page">
      {/* Back to Home Button */}
      <div className="navigation-header">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>👥 Member Management</h1>
      </div>

      {/* Header */}
      <div className="members-header">
        <h1>Member Management</h1>
        <p>Manage and view all office members</p>
      </div>

      {/* Controls Section */}
      <div className="members-controls">
        <div className="search-filter">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, ID, district, town..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="filter-group">
            <div className="filter-box">
              <label>District:</label>
              <select 
                value={filterDistrict} 
                onChange={(e) => setFilterDistrict(e.target.value)}
              >
                {sriLankanDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div className="filter-box">
              <label>Status:</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button 
          className="add-member-btn"
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (!showAddForm) {
              setNewMember({
                ...newMember,
                memberId: generateMemberId()
              });
            }
          }}
        >
          {showAddForm ? '✕ Cancel' : '+ Add New Member'}
        </button>
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <div className="add-member-form">
          <h2>Register New Member</h2>
          <form onSubmit={handleAddMember}>
            <div className="form-grid">
              <div className="form-group">
                <label> MemberId *</label>
                <input
                  type="text"
                  name="memberId"
                  value={newMember.memberId}
                  onChange={handleInputChange}
                  required
                  readOnly
                  className="readonly-field"
                />
              </div>

              <div className="form-group">
                <label>ID Number</label>
                <input
                  type="text"
                  name="idNumber"
                  value={newMember.idNumber}
                  onChange={handleInputChange}
                  placeholder="Enter ID Number"
                />
              </div>

              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newMember.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter member's full name"
                />
              </div>

              <div className="form-group">
                <label>District *</label>
                <select
                  name="district"
                  value={newMember.district}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select District</option>
                  {sriLankanDistricts.filter(d => d !== 'All').map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Near Town *</label>
                <input
                  type="text"
                  name="nearTown"
                  value={newMember.nearTown}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Bambalapitiya, Kadawatha"
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  value={newMember.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+94 77 123 4567"
                />
              </div>

             

             


            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">Register Member</button>
              <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Member Statistics */}
      <div className="member-stats">
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div className="stat-info">
            <h3>Total Members</h3>
            <p>{members.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div className="stat-info">
            <h3>Active</h3>
            <p>{members.filter(m => m.status === 'Active').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏖️</span>
          <div className="stat-info">
            <h3>On Leave</h3>
            <p>{members.filter(m => m.status === 'On Leave').length}</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📍</span>
          <div className="stat-info">
            <h3>Districts</h3>
            <p>{new Set(members.map(m => m.district)).size}</p>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="members-list">
        <h2>Registered Members</h2>
        {filteredMembers.length === 0 ? (
          <div className="no-results">
            <p>No members found</p>
          </div>
        ) : (
          <div className="member-cards">
            {filteredMembers.map(member => (
              <div key={member.id} className="member-card">
                <div className="member-card-header">
                  <div className="member-avatar">
                    {member.name.charAt(0)}
                  </div>
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    <span className="member-id">{member.memberId}</span>
                    <span className={`member-status ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    🗑️
                  </button>
                </div>

                <div className="member-card-body">
                  <div className="member-detail">
                    <span className="detail-label">📍 District:</span>
                    <span className="detail-value">{member.district}</span>
                  </div>
                  <div className="member-detail">
                    <span className="detail-label">🏘️ Near Town:</span>
                    <span className="detail-value">{member.nearTown}</span>
                  </div>
                  <div className="member-detail">
                    <span className="detail-label">📞 Phone:</span>
                    <span className="detail-value">{member.phone}</span>
                  </div>
                  <div className="member-detail">
                    <span className="detail-label">✉️ ID Number:</span>
                    <span className="detail-value">{member.idNumber || 'N/A'}</span>
                  </div>
                </div>

                <div className="member-card-footer">
                  <button className="edit-btn">Edit Details</button>
                  <button className="schedule-btn">View Transport</button>
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