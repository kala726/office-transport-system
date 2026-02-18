const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Driver name is required'],
    trim: true 
  },
  licenseNo: { 
    type: String, 
    required: [true, 'License number is required'],
    unique: true,
    trim: true 
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    trim: true 
  },
  email: { 
    type: String, 
    trim: true,
    lowercase: true 
  },
  experience: { 
    type: Number, 
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  address: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['Available', 'On Trip', 'Off', 'Training'],
    default: 'Available' 
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