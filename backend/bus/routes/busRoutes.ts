// backend/bus/busRoutes.ts
import express from "express";
import { getBuses, getSchedules, createSchedule, deleteSchedule } from "../controllers/busController";

const router = express.Router();

router.get("/info", getBuses); // GET /bus/info (Thông tin xe)
router.get("/schedule/today", getSchedules); // GET /bus/schedule/today (Lịch trình hôm nay)
router.post("/schedule/create", createSchedule); // POST /buses/schedule/create
router.delete("/schedule/:id", deleteSchedule);

export default router;