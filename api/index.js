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

const connectDB = async () => {
    if (isConnected) {
        console.log('✅ Using existing database connection');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // Timeout early if connection fails
        });
        isConnected = db.connections[0].readyState === 1;
        console.log('✅ New MongoDB Connection Established!');
    } catch (err) {
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

// Vercel සඳහා app එක export කිරීම
module.exports = app;