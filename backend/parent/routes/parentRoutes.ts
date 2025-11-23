// backend/parent/parentRoutes.ts
import express from "express";
import { getParents, getParent, getParentAndStudents, getParentNotifications } from "../controllers/parentController";

const router = express.Router();

// GET /parent/account/:maTK
router.get("/account/:maTK", getParentAndStudents);

// GET /parent/notifications/:maTK
router.get("/notifications/:maTK", getParentNotifications);

router.get("/", getParents); // GET /parents
router.get("/:id", getParent); // GET /parents/:id

export default router;