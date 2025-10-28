const express = require("express");
const router = express.Router();
const { handlePowercoursesChat } = require("../controllers/powercourseChat"); // adjust path if needed

// POST route for chat
router.post("/powercourses/chat", handlePowercoursesChat);

module.exports = router;
