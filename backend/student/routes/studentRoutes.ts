// backend/student/studentRoutes.ts
import express from "express";
import { getStudents, getStudent } from "../controllers/studentController";

const router = express.Router();

router.get("/", getStudents); // GET /students
router.get("/:id", getStudent); // GET /students/:id

export default router;