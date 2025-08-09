const express = require("express");
const router = express.Router();
const footballController = require("../controllers/footballController");

// Only one combined endpoint
router.get("/all", footballController.getAllMatches);

module.exports = router;
