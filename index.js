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
const matchRoutes = require('./routes/cricketRoutes');
const footbalRoutes = require('./routes/footbalRoutes');
const hockeyRoutes = require('./routes/hockeyRoutes');
const basketballRoutes = require('./routes/basketballRoutes');
const tennisRoutes = require('./routes/tennisRoutes')
app.use('/api', basketballRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api', footbalRoutes);
app.use('/api', hockeyRoutes);
app.use('/api', tennisRoutes);


// Export handler for Vercel
module.exports = (req, res) => {
  app(req, res);
};
