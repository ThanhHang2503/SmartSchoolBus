import express from "express";
import {
  getStudents,
  getStudent,
  createStudent,
  editStudent,
  removeStudent,
} from "../controllers/studentController";

const router = express.Router();

// 📌 GET /student → Lấy toàn bộ học sinh
router.get("/", getStudents);

// 📌 GET /student/:id → Lấy học sinh theo ID
router.get("/:id", getStudent);

// 📌 POST /student → Thêm học sinh mới
router.post("/", createStudent);

// 📌 PUT /student/:id → Cập nhật thông tin học sinh
router.put("/:id", editStudent);

// 📌 DELETE /student/:id → Xóa học sinh
router.delete("/:id", removeStudent);

export default router;
