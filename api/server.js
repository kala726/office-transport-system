const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// --- 1. Middlewares ---
app.use(express.json());

// CORS එක එක පාරක් පමණක් නිවැරදිව මෙලෙස දාන්න
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:5001",
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));

// --- 2. MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB Connected!"))
    .catch(err => console.log("❌ Connection Error:", err));

// --- 3. API Routes (External Files) ---
// ඔයා routes වෙනම ලියලා තියෙනවා නම් මේවා හරියටම වැඩ කරයි
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));

// --- 4. Server Start ---
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// Export the Express API for Vercel
module.exports = app;