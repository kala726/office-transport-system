const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// සියලුම රියදුරන් ලබා ගැනීම
router.get('/', async (req, res) => {
    try {
        const drivers = await Driver.find().sort({ createdAt: -1 });
        res.json(drivers);
    } catch (err) {
        res.status(500).json({ message: "Drivers ලබා ගැනීම අසාර්ථකයි", error: err.message });
    }
});

// අලුත් රියදුරෙක් ඇතුළත් කිරීම
router.post('/add', async (req, res) => {
    const newDriver = new Driver(req.body);
    try {
        const savedDriver = await newDriver.save();
        res.status(201).json(savedDriver);
    } catch (err) {
        res.status(400).json({ message: "රියදුරු ඇතුළත් කිරීම අසාර්ථකයි", error: err.message });
    }
});

// රියදුරෙක් ඉවත් කිරීම
router.delete('/:id', async (req, res) => {
    try {
        await Driver.findByIdAndDelete(req.params.id);
        res.json({ message: "Driver removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;