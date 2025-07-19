const express = require('express');
const router = express.Router();
const { getRugbyMatches } = require('../controllers/rugbyController');

router.get('/rugby', getRugbyMatches);

module.exports = router;
