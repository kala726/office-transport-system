const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json({ success: true, data: drivers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json({ success: true, data: driver });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Driver deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;