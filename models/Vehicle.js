const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registrationNo: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['Bus', 'Van', 'Car', 'Lorry', 'Jeep'] },
  model: { type: String },
  capacity: { type: Number, required: true },
  driver: { type: String },
  status: { type: String, default: 'Active', enum: ['Active', 'Maintenance'] },
  fuelType: { type: String, enum: ['Diesel', 'Petrol'] }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);