const express = require('express');
const router = express.Router();
const { getLiveFootballMatches } = require('../controllers/footballController');

router.get('/footbal-live', getLiveFootballMatches);

module.exports = router;
