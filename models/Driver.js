const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Driver name is required'],
    trim: true 
  },
  idNumber: { 
    type: String,
    trim: true 
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    trim: true 
  },
  homeTown: {
    type: String,
    trim: true
  },
  address: { 
    type: String 
  },
  status: { 
    type: String, 
    default: 'Active' 
  },
  // Legacy or optional fields
  licenseNo: { 
    type: String, 
    trim: true 
  },
  email: { 
    type: String, 
    trim: true,
    lowercase: true 
  },
  experience: { 
    type: Number, 
    min: [0, 'Experience cannot be negative']
  },
  vehicleAssigned: { 
    type: String,
    default: 'Not Assigned'
  },
  joinDate: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Driver', driverSchema);