// backend/parent/parentRoutes.ts
import express from "express";
import { getParents, getParent, getParentAndStudents, getParentNotifications, getDriverLocationForParent } from "../controllers/parentController";

const router = express.Router();

// GET /parent/account/:maTK
router.get("/account/:maTK", getParentAndStudents);

// GET /parent/notifications/:maTK
router.get("/notifications/:maTK", getParentNotifications);
router.get("/driver-location/:maTK", getDriverLocationForParent); // GET driver's last known position for this parent's students (dev)

router.get("/", getParents); // GET /parents
router.get("/:id", getParent); // GET /parents/:id

export default router;