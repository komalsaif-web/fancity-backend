const express = require('express');
const router = express.Router();
const f1Controller = require('../controllers/f1Controller');

router.get('/f1/live', f1Controller.getLiveF1Races);
router.get('/f1/upcoming', f1Controller.getUpcomingF1Races);

module.exports = router;
