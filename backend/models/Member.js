const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  memberId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  district: { type: String, required: true },
  nearTown: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);