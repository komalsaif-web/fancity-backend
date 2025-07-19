const express = require('express');
const router = express.Router();
const sportsController = require('../controllers/basketballController');

// ✅ Dynamic sport live scores route
router.get('/:sport/live-scores', sportsController.getLiveScoresBySport);

module.exports = router;
