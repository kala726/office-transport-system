const mongoose = require('mongoose');
const tripSchema = new mongoose.Schema({
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    destination: String,
    date: Date,
    status: { type: String, default: 'Scheduled' }
});
module.exports = mongoose.model('Trip', tripSchema);