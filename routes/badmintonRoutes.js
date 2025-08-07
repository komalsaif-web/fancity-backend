const express = require('express');
const router = express.Router();
const badmintonController = require('../controllers/badmintonController');

router.get('/live', badmintonController.getLiveMatches);
router.get('/upcoming', badmintonController.getUpcomingMatches);
router.get('/past', badmintonController.getPastMatches);

module.exports = router;
