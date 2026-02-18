const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// CORS settings
app.use(cors({
  origin: ['http://localhost:3000', 'https://office-transport-system.vercel.app'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/members', require('./routes/members'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});