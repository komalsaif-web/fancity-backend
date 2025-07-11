const express = require('express');
const router = express.Router();
const { getLiveMatches } = require('../controllers/matchController');

router.get('/live', getLiveMatches);

module.exports = router;
