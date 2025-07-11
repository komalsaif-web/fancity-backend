// routes/basketballRoutes.js
const express = require('express');
const router = express.Router();
const { getLiveBasketballMatches } = require('../controllers/basketballController');

router.get('/basketball-live', getLiveBasketballMatches);
module.exports = router;
