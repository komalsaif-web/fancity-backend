// api/index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Routes
const matchRoutes = require('../routes/matchRoutes'); // adjust path if needed
app.use('/api/matches', matchRoutes);

// Export handler for Vercel
module.exports = (req, res) => {
  app(req, res);
};
