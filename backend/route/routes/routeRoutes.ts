// backend/route/routes/routeRoutes.ts (hoặc backend/common/routes/routeRoutes.ts)
import express from "express";
import { getRoutes, getRoute } from "../controllers/routeController";

const router = express.Router();

// 📌 GET /routes → lấy tất cả
router.get("/", getRoutes);

// 📌 GET /routes/:id → lấy theo ID
router.get("/:id", getRoute);

export default router;