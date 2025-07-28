const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Default root route to avoid "Cannot GET /"
app.get('/', (req, res) => {
  res.send('🚀 FanCity Backend API is running!');
});

// Routes
const cricketRoutes = require('./routes/cricketRoutes');
const authRoute = require('./routes/authRoutes');
app.use('/api', cricketRoutes);
app.use('/api', authRoute);



// Export handler for Vercel
module.exports = (req, res) => {
  app(req, res);
};
