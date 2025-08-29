const express = require("express");
const router = express.Router();
const {
  getPastRaces, getUpcomingRaces, getLiveRaces,
  getPastInternationalRaces, getUpcomingInternationalRaces, getLiveInternationalRaces,
  getPastLeagueRaces, getUpcomingLeagueRaces, getLiveLeagueRaces,
} = require("../controllers/f1Controller");

// Formula 1
router.get("/past", getPastRaces);
router.get("/upcoming", getUpcomingRaces);
router.get("/live", getLiveRaces);

// International
router.get("/international/past", getPastInternationalRaces);
router.get("/international/upcoming", getUpcomingInternationalRaces);
router.get("/international/live", getLiveInternationalRaces);

// League
router.get("/league/past", getPastLeagueRaces);
router.get("/league/upcoming", getUpcomingLeagueRaces);
router.get("/league/live", getLiveLeagueRaces);

module.exports = router;