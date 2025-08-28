const express = require("express");
const router = express.Router();
const { getPastRaces, getUpcomingRaces, getLiveRaces } = require("../controllers/f1Controller");

router.get("/past", getPastRaces);
router.get("/upcoming", getUpcomingRaces);
router.get("/live", getLiveRaces);

module.exports = router;
