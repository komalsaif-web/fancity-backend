const express = require('express');
const router = express.Router();
const { fetchBadmintonData } = require('../controllers/badmintonController');

// Endpoint: /api/badminton?type=live | past | upcoming
router.get('/badminton', fetchBadmintonData);

module.exports = router;
