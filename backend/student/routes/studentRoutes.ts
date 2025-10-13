import express from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController";

const router = express.Router();

// Lấy tất cả học sinh
router.get("/", getAllStudents);

// Lấy học sinh theo id
router.get("/:id", getStudentById);

// Thêm học sinh mới
router.post("/", createStudent);

// Cập nhật học sinh
router.put("/:id", updateStudent);

// Xóa học sinh
router.delete("/:id", deleteStudent);

export default router;
