const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Config load කිරීම
dotenv.config();

const app = express();

// --- 1. Middlewares ---
app.use(cors());
app.use(express.json());

// --- 2. MongoDB Connection ---
let isConnected = false;
let connectionError = null;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        isConnected = db.connections[0].readyState === 1;
        connectionError = null;
        console.log('✅ New MongoDB Connection Established!');
    } catch (err) {
        connectionError = err.message;
        console.error("❌ MongoDB Connection Error:", err);
    }
};

// Vercel වලදී හැම request එකකදීම Database එකට connect වෙලාද බලන්න ඕනේ
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// --- 3. API Routes ---
// Routes files නිවැරදිව require කිරීම
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));

// --- 4. Health Check Route ---
app.get("/", (req, res) => {
    res.status(200).send("Fleet Management API is live and running!");
});

app.get("/api/test-db", async (req, res) => {
    try {
        const uri = process.env.MONGODB_URI;
        res.status(200).json({
            message: "Test endpoint",
            uriExists: !!uri,
            uriPrefix: uri ? uri.substring(0, 15) + "..." : "none",
            isConnected: isConnected,
            readyState: mongoose.connection.readyState,
            error: connectionError
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Vercel සඳහා app එක export කිරීම
module.exports = app;