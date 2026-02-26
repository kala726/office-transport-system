const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    memberId: { type: String, required: true }, // EMP001 වැනි අංකය
    idNumber: String,  // NIC අංකය
    name: { type: String, required: true },
    district: String,
    nearTown: String,
    address: String,
    phone: String,
    status: { type: String, default: 'Active' } // Active, On Leave, Inactive
});

module.exports = mongoose.model('Member', memberSchema);