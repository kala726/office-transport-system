const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Vehicle = require('./models/Vehicle');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB Connected!"))
    .catch(err => console.log("❌ Connection Error:", err));

// --- API Routes ---
// Routes සම්බන්ධ කිරීම
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));

// 1. සියලුම වාහන ලබා ගැනීම (GET)
app.get('/api/vehicles', async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. අලුත් වාහනයක් ඇතුළත් කිරීම (POST)
app.post('/api/vehicles', async (req, res) => {
    const newVehicle = new Vehicle(req.body);
    try {
        const savedVehicle = await newVehicle.save();
        res.status(201).json(savedVehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 3. වාහනයක් ඉවත් කිරීම (DELETE)
app.delete('/api/vehicles/:id', async (req, res) => {
    try {
        await Vehicle.findByIdAndDelete(req.params.id);
        res.json({ message: "Vehicle Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));