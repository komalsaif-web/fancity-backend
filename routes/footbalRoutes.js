const express = require('express');
const router = express.Router();
const {
  getLiveFootballMatches,
  getUpcomingFootballMatches
} = require('../controllers/footballController');

router.get('/football-live', getLiveFootballMatches);

router.get('/upcoming-football', getUpcomingFootballMatches);

module.exports = router;
