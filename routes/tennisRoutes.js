const express = require('express');
const router = express.Router();
const { getLiveTennisMatches } = require('../controllers/tennisController');

router.get('/tennis-live', getLiveTennisMatches);

module.exports = router;
