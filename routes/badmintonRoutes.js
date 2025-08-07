const express = require('express');
const router = express.Router();
const {
  getPastMatches,
  getUpcomingMatches,
  getLiveMatch,
} = require('../controllers/badmintonController');

router.get('/past', getPastMatches);
router.get('/upcoming', getUpcomingMatches);
router.get('/live', getLiveMatch);

module.exports = router;
