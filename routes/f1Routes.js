const express = require("express");
const { getF1Races } = require("../controllers/f1Controller");

const router = express.Router();

// GET /api/f1/races?country=UAE&type=live|upcoming|past
router.get("/races", getF1Races);

module.exports = router;
