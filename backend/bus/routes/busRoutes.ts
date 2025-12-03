import express from "express";
import { getBuses, getSchedules, createSchedule, deleteSchedule, assignStudentsToSchedule } from "../controllers/busController";

const router = express.Router();

// Xe
router.get("/info", getBuses); // GET /buses/info

// Lịch trình
router.get("/schedule/today", getSchedules); // GET /buses/schedule/today
router.get("/schedule/date/:date", getSchedules); // GET /buses/schedule/date/yyyy-mm-dd
router.post("/schedule/create", createSchedule); // POST /buses/schedule/create
router.post("/schedule/assign-students", assignStudentsToSchedule); // POST /buses/schedule/assign-students
router.delete("/schedule/:id", deleteSchedule); // DELETE /buses/schedule/:id

export default router;
