// backend/driver/driverRoutes.ts
import express from "express";
import { getDrivers, getDriver } from "../controllers/driverController";

const router = express.Router();

router.get("/", getDrivers); // GET /drivers
router.get("/:id", getDriver); // GET /drivers/:id

export default router;