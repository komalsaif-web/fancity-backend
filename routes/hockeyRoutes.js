const express = require("express");
const router = express.Router();
const hockeyController = require("../controllers/hockeyController");

// Only one combined endpoint
router.get("/all", hockeyController.getAllMatches);

module.exports = router;
