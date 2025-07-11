const express = require('express');
const router = express.Router();
const { getLiveHockeyMatches } = require('../controllers/hockeyController');

router.get('/hockey-live', getLiveHockeyMatches);

module.exports = router;
