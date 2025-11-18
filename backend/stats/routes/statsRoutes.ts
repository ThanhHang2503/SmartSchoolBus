// backend/stats/routes/statsRoutes.ts
import express from "express";
import { getTripsPerDay } from "../controllers/statsController";

const router = express.Router();

router.get("/trips-per-day", getTripsPerDay);

export default router;
