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
const authRoute = require('./routes/authRoutes');
const hockeyRoutes = require('./routes/hockeyRoutes');
const f1Routes = require('./routes/f1Routes');
const storageRoutes = require('./routes/storageRoutes');

app.use('/api', authRoute);
app.use('/api', hockeyRoutes);
app.use('/api/f1', f1Routes);
app.use('/api', storageRoutes);



// Export handler for Vercel
module.exports = (req, res) => {
  app(req, res);
};
