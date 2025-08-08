const express = require("express");
const router = express.Router();
const hockeyController = require("../controllers/hockeyController");

// All combined
router.get("/all", hockeyController.getAllMatches);

// International
router.get("/international/past", hockeyController.getPastInternational);
router.get("/international/upcoming", hockeyController.getUpcomingInternational);
router.get("/international/live", hockeyController.getLiveInternational);

// League
router.get("/league/past", hockeyController.getPastLeague);
router.get("/league/upcoming", hockeyController.getUpcomingLeague);
router.get("/league/live", hockeyController.getLiveLeague);

module.exports = router;
