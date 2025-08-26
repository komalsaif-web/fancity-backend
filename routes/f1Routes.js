const express = require("express");
const router = express.Router();
const f1Controller = require("../controllers/f1Controller");

// Only one combined endpoint
router.get("/all", f1Controller.getAllMatches);

module.exports = router;
