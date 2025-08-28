const express = require("express");
const router = express.Router();
const {
  getLiveRaces,
  getPastRaces,
  getUpcomingRaces,
} = require("../controllers/f1Controller");

router.get("/live", getLiveRaces);
router.get("/past", getPastRaces);
router.get("/upcoming", getUpcomingRaces);

module.exports = router;
