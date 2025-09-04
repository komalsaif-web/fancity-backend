const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Root route (health check)
app.get("/", (req, res) => {
  res.send("🚀 FanCity Backend API is running on Vercel!");
});

// Import routes
const authRoute = require("./routes/authRoutes");
const hockeyRoutes = require("./routes/hockeyRoutes");
const f1Routes = require("./routes/f1Routes");
const storageRoutes = require("./routes/storageRoutes");
const basketballRoutes = require("./routes/basketballRoutes");

// ✅ Mount routes with prefixes
app.use("/api/auth", authRoute);
app.use("/api/hockey", hockeyRoutes);
app.use("/api/f1", f1Routes);
app.use("/api/storage", storageRoutes);
app.use("/api/basketball", basketballRoutes);

// ✅ Export app for Vercel (serverless)
module.exports = app;
