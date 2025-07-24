const express = require('express');
const router = express.Router();
const {
  getLiveFootballMatches,
getFootballFixtures
} = require('../controllers/footballController');

router.get('/football-live', getLiveFootballMatches);

router.get('/upcoming-football', getFootballFixtures);

module.exports = router;
