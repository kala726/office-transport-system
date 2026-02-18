const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registrationNo: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['Bus', 'Van', 'Car'] },
  capacity: { type: Number, required: true },
  driver: { type: String, required: true },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);