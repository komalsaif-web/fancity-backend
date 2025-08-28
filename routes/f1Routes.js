import express from "express";
import { getF1Races } from "../controllers/f1Controller.js";

const router = express.Router();

// GET /api/f1/races?country=UAE&type=live|upcoming|past
router.get("/races", getF1Races);

export default router;
