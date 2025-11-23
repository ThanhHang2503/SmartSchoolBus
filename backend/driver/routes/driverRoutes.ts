// backend/driver/driverRoutes.ts
import express from "express";
import { getDrivers, getDriver } from "../controllers/driverController";
import { getCurrentDriver, getCurrentDriverSchedules } from "../controllers/driverController";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/", getDrivers); // GET /drivers
// router.get("/:id", getDriver); // GET /drivers/:id
router.get("/me", verifyToken, getCurrentDriver); // <-- route mới, bảo vệ bằng token
router.get("/me/schedules", verifyToken, getCurrentDriverSchedules);

export default router;