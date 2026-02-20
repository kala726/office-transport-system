const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// සියලුම වාහන ලබා ගැනීම
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find().sort({ createdAt: -1 });
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// අලුත් වාහනයක් ඇතුළත් කිරීම
router.post('/add', async (req, res) => {
    const newVehicle = new Vehicle(req.body);
    try {
        const savedVehicle = await newVehicle.save();
        res.status(201).json(savedVehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// වාහනයක් ඉවත් කිරීම
router.delete('/:id', async (req, res) => {
    try {
        await Vehicle.findByIdAndDelete(req.params.id);
        res.json({ message: "Vehicle deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;