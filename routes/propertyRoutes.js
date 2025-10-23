const express = require("express");
const { handleChat } = require("../controllers/propertyController");
const router = express.Router();

router.post("/chat", handleChat);

module.exports = router;
