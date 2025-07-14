const express = require('express');
const router = express.Router();
const {
  getLiveMatches,
  getUpcomingMatches
} = require('../controllers/cricketController');

router.get('/cricket/live', getLiveMatches); // 🔴 Live
router.get('/cricket/upcoming', getUpcomingMatches); // 🟡 Upcoming

module.exports = router;
