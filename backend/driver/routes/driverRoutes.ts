// backend/driver/driverRoutes.ts
import express from "express";
import { getDrivers} from "../controllers/driverController";
import { getCurrentDriver, getCurrentDriverSchedules, getDriverNotifications, UpdateStudentStatus } from "../controllers/driverController";
import { verifyToken, driverMiddleware } from "../middleware/verifyToken";
import { updateDriverLocation, getDriverLocation } from "../controllers/locationController";

const router = express.Router();

router.get("/", getDrivers); // GET /drivers
router.get("/me", verifyToken, driverMiddleware, getCurrentDriver); // GET /driver/me dùng token
router.get("/me/schedules", verifyToken, driverMiddleware, getCurrentDriverSchedules); // GET /driver/me/schedules dùng token
router.get("/me/notifications/", verifyToken, driverMiddleware, getDriverNotifications); // GET /driver/me/notifications dùng token
// Driver location endpoints
router.post("/location", verifyToken, driverMiddleware, updateDriverLocation); // POST driver location (driver only)
// Test endpoint (no auth) for simulation/dev only
// Test endpoint (no auth) for simulation/dev only — only enable when not in production
if (process.env.NODE_ENV !== 'production') {
	router.post("/location/test", updateDriverLocation); // POST driver location without auth (dev)
}
// Debug: return all in-memory driver positions (dev only)
if (process.env.NODE_ENV !== 'production') {
	const { getAllDriverPositions } = require('../locationStore');
	router.get('/positions/debug', (req, res) => {
		res.json({ success: true, positions: getAllDriverPositions() });
	});
}
router.get("/location/:driverId", getDriverLocation); // GET last known location for driver
router.put("/update-status", UpdateStudentStatus);
export default router;