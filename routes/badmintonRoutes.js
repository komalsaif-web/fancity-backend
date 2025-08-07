const express = require('express');
const router = express.Router();
const {
  getLiveMatches,
  getUpcomingMatches,
  getPastMatches
} = require('../controllers/matchController');

router.get('/live', getLiveMatches);
router.get('/upcoming', getUpcomingMatches);
router.get('/past', getPastMatches);

module.exports = router;
