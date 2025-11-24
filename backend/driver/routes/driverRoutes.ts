// backend/driver/driverRoutes.ts
import express from "express";
import { getDrivers} from "../controllers/driverController";
import { getCurrentDriver, getCurrentDriverSchedules, getDriverNotifications, UpdateStudentStatus } from "../controllers/driverController";
import { verifyToken, driverMiddleware } from "../middleware/verifyToken";

const router = express.Router();

router.get("/", getDrivers); // GET /drivers
router.get("/me", verifyToken, driverMiddleware, getCurrentDriver); // GET /driver/me dùng token
router.get("/me/schedules", verifyToken, driverMiddleware, getCurrentDriverSchedules); // GET /driver/me/schedules dùng token
router.get("/me/notifications/", verifyToken, driverMiddleware, getDriverNotifications); // GET /driver/me/notifications dùng token
router.put("/update-status", UpdateStudentStatus);
export default router;