const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// GET all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new vehicle
router.post('/', async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE vehicle
router.delete('/:id', async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Vehicle deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;