const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    registrationNo: { type: String, required: true },
    type: { type: String, required: true },
    model: String,
    capacity: Number,
    driver: String,
    status: { type: String, default: 'Active' },
    fuelType: String,
    lastMaintenance: String
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);