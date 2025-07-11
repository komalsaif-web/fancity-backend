const express = require('express');
const router = express.Router();
const { getLiveMatches } = require('../controllers/cricketController');

router.get('/live', getLiveMatches);

module.exports = router;
