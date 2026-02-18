const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNo: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  experience: { type: Number, required: true },
  status: { type: String, default: 'Available' }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);