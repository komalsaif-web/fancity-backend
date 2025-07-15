const express = require('express');
const router = express.Router();
const {
  getLiveFootballMatches,
  getUpcomingFootballMatches
} = require('../controllers/footballController');

router.get('/live', getLiveFootballMatches);
router.get('/upcoming', getUpcomingFootballMatches);

module.exports = router;
