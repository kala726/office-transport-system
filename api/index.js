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
let connectionError = null;

// Disable Mongoose global buffering to prevent hanging on connection failure
mongoose.set('bufferCommands', false);

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return true;
    
    if (!process.env.MONGODB_URI) {
        connectionError = 'MONGODB_URI is missing in Vercel Environment Variables';
        console.error("❌", connectionError);
        return false;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        connectionError = null;
        console.log('✅ New MongoDB Connection Established!');
        return true;
    } catch (err) {
        connectionError = err.message;
        console.error("❌ MongoDB Connection Error:", err.message);
        return false;
    }
};

// Vercel වලදී හැම request එකකදීම Database එකට connect වෙලාද බලන්න ඕනේ
app.use(async (req, res, next) => {
    const connected = await connectDB();
    if (!connected) {
        return res.status(500).json({ 
            success: false, 
            message: "Database connection failed",
            error: connectionError 
        });
    }
    next();
});

// --- 3. API Routes ---
// Import the routes from the root routes directory (which contain the fixes and correct schemas)
app.use('/api/vehicles', require('../routes/vehicles'));
app.use('/api/members', require('../routes/members'));
app.use('/api/drivers', require('../routes/drivers'));

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
            readyState: mongoose.connection.readyState,
            error: connectionError
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Vercel සඳහා app එක export කිරීම
module.exports = app;