const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');

// සියලුම ට්‍රිප් විස්තර (වාහන සහ රියදුරු විස්තර සමඟ) ලබා ගැනීම
router.get('/', async (req, res) => {
    try {
        const trips = await Trip.find()
            .populate('vehicleId') // Vehicle model එකේ දත්ත එකතු කරයි
            .populate('driverId')  // Driver model එකේ දත්ත එකතු කරයි
            .sort({ createdAt: -1 });
        res.json(trips);
    } catch (err) {
        res.status(500).json({ message: "Trips ලබා ගැනීම අසාර්ථකයි", error: err.message });
    }
});

// නව ට්‍රිප් එකක් ප්ලෑන් කර සේව් කිරීම
router.post('/plan', async (req, res) => {
    const newTrip = new Trip({
        vehicleId: req.body.vehicleId,
        driverId: req.body.driverId,
        members: req.body.members,
        destination: req.body.destination,
        date: req.body.date,
        status: 'Scheduled'
    });

    try {
        const savedTrip = await newTrip.save();
        res.status(201).json(savedTrip);
    } catch (err) {
        res.status(400).json({ message: "Trip එක ප්ලෑන් කිරීම අසාර්ථකයි", error: err.message });
    }
});

module.exports = router;