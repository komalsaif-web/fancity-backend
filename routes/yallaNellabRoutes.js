const express = require("express");
const router = express.Router();
const { handleChat } = require("../controllers/yallaNellabController");

// POST /api/yallaNellab/chat
router.post("/chat", handleChat);

module.exports = router;
