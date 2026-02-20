const mongoose = require('mongoose');
const driverSchema = new mongoose.Schema({
    name: String,
    licenseNo: String,
    phone: String,
    status: { type: String, default: 'Available' }
});
module.exports = mongoose.model('Driver', driverSchema);