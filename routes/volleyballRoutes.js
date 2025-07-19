// routes/volleyballRoutes.js
const express = require('express');
const router = express.Router();
const { getLiveVolleyballScores } = require('../controllers/volleyballController');

router.get('/vollybal', getLiveVolleyballScores);

module.exports = router;
