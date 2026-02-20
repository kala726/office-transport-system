const mongoose = require('mongoose');
const memberSchema = new mongoose.Schema({
    name: String,
    nic: String,
    phone: String,
    email: String,
    department: String
});
module.exports = mongoose.model('Member', memberSchema);