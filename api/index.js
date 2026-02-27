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
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB Connected Successfully!'))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));


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

// --- 5. Port එකට සවන් දීම (Render වැනි සේවා සඳහා) ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});