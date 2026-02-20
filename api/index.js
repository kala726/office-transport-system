const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Models (මේවා ඔබේ models folder එකේ ඇති බව තහවුරු කරගන්න)
const Vehicle = require('../models/Vehicle');
const Member = require('../models/Member');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');

// Routes (මේවා ඔබේ routes folder එකේ ඇති බව තහවුරු කරගන්න)
const vehicleRoutes = require('../routes/vehicleRoutes');
const memberRoutes = require('../routes/memberRoutes');
const driverRoutes = require('../routes/driverRoutes');
const tripRoutes = require('../routes/tripRoutes');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB Connected!"))
    .catch(err => console.log("❌ Connection Error:", err));

// Routes සම්බන්ධ කිරීම
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);

// Vercel සඳහා ඉතාම වැදගත් කොටස (Listen වෙනුවට export කරන්න)
module.exports = app;