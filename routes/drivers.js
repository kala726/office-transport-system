const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// ============= GET ALL DRIVERS =============
// GET /api/drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching drivers',
      error: error.message
    });
  }
});

// ============= GET SINGLE DRIVER =============
// GET /api/drivers/:id
router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: driver
    });
  } catch (error) {
    console.error('Error fetching driver:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching driver',
      error: error.message
    });
  }
});

// ============= CREATE NEW DRIVER =============
// POST /api/drivers
router.post('/', async (req, res) => {
  try {
    // Check if license number already exists
    const existingDriver = await Driver.findOne({ licenseNo: req.body.licenseNo });
    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: 'Driver with this license number already exists'
      });
    }

    const driver = new Driver(req.body);
    await driver.save();
    
    res.status(201).json({
      success: true,
      message: 'Driver created successfully',
      data: driver
    });
  } catch (error) {
    console.error('Error creating driver:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating driver',
      error: error.message
    });
  }
});

// ============= UPDATE DRIVER =============
// PUT /api/drivers/:id
router.put('/:id', async (req, res) => {
  try {
    // Check if license number is being changed and if it already exists
    if (req.body.licenseNo) {
      const existingDriver = await Driver.findOne({ 
        licenseNo: req.body.licenseNo,
        _id: { $ne: req.params.id }
      });
      
      if (existingDriver) {
        return res.status(400).json({
          success: false,
          message: 'Driver with this license number already exists'
        });
      }
    }

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Driver updated successfully',
      data: driver
    });
  } catch (error) {
    console.error('Error updating driver:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating driver',
      error: error.message
    });
  }
});

// ============= DELETE DRIVER =============
// DELETE /api/drivers/:id
router.delete('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting driver',
      error: error.message
    });
  }
});

// ============= GET DRIVERS BY STATUS =============
// GET /api/drivers/status/:status
router.get('/status/:status', async (req, res) => {
  try {
    const drivers = await Driver.find({ status: req.params.status });
    
    res.status(200).json({
      success: true,
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    console.error('Error fetching drivers by status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching drivers',
      error: error.message
    });
  }
});

// ============= SEARCH DRIVERS =============
// GET /api/drivers/search/:query
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const drivers = await Driver.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { licenseNo: { $regex: searchQuery, $options: 'i' } },
        { phone: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    console.error('Error searching drivers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching drivers',
      error: error.message
    });
  }
});

module.exports = router;