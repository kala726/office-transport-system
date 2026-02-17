const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  memberId: { 
    type: String, 
    required: [true, 'Member ID is required'],
    unique: true,
    trim: true 
  },
  name: { 
    type: String, 
    required: [true, 'Member name is required'],
    trim: true 
  },
  district: { 
    type: String, 
    required: [true, 'District is required'],
    trim: true 
  },
  nearTown: { 
    type: String, 
    required: [true, 'Near town is required'],
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
  department: { 
    type: String,
    trim: true 
  },
  designation: { 
    type: String,
    trim: true 
  },
  status: { 
    type: String, 
    enum: ['Active', 'On Leave', 'Inactive'],
    default: 'Active' 
  },
  joinDate: { 
    type: Date, 
    default: Date.now 
  },
  address: { 
    type: String 
  }
}, { 
  timestamps: true 
});

// Generate memberId before saving if not provided
memberSchema.pre('save', async function(next) {
  if (!this.memberId) {
    const lastMember = await this.constructor.findOne().sort({ createdAt: -1 });
    let nextNumber = 1;
    
    if (lastMember && lastMember.memberId) {
      const lastNumber = parseInt(lastMember.memberId.replace('EMP', ''));
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }
    
    this.memberId = `EMP${String(nextNumber).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Member', memberSchema);