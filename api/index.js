const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Root route (health check)
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "🚀 FanCity Backend API is running on Vercel!",
    time: new Date().toISOString(),
  });
});

// Import routes
const authRoute = require("../routes/authRoutes");
const hockeyRoutes = require("../routes/hockeyRoutes");
const f1Routes = require("../routes/f1Routes");
const storageRoutes = require("../routes/storageRoutes");
const basketballRoutes = require("../routes/basketballRoutes");
// const propertyRoutes = require("../routes/propertyRoutes"); 

// ✅ Mount routes
app.use("/api/auth", authRoute);
app.use("/api/hockey", hockeyRoutes);
app.use("/api/f1", f1Routes);
app.use("/api/storage", storageRoutes);
app.use("/api/basketball", basketballRoutes);
// app.use("/api", propertyRoutes);

// ✅ Export app for Vercel
module.exports = app;
