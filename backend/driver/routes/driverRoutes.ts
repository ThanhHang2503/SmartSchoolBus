// backend/driver/driverRoutes.ts
import express from "express";
import { getDrivers} from "../controllers/driverController";
import { getCurrentDriver, getCurrentDriverSchedules, getDriverNotifications } from "../controllers/driverController";
import { verifyToken, driverMiddleware } from "../middleware/verifyToken";
import { updateDriverLocation, getDriverLocation } from "../controllers/locationController";

const router = express.Router();

router.get("/", getDrivers); // GET /drivers
router.get("/me", verifyToken, driverMiddleware, getCurrentDriver); // GET /driver/me dùng token
router.get("/me/schedules", verifyToken, driverMiddleware, getCurrentDriverSchedules); // GET /driver/me/schedules dùng token
router.get("/me/notifications/", verifyToken, driverMiddleware, getDriverNotifications); // GET /driver/me/notifications dùng token
// Driver location endpoints
router.post("/location", verifyToken, driverMiddleware, updateDriverLocation); // POST driver location (driver only)
router.get("/location/:driverId", getDriverLocation); // GET last known location for driver
export default router;