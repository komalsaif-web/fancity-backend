// routes/sports.js
const express = require('express');
const router = express.Router();
const { getLiveSports } = require('../controllers/sportsController');

// Route: GET /api/sports/:sport
router.get('/:sport', getLiveSports);

module.exports = router;
