import express from "express";
import { verifyToken } from "../../middleware";

import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController";

const router = express.Router();

//ThanhHang // Lấy tất cả học sinh khi không có middleware - ai cũng gọi được
router.get("/", getAllStudents);

// myduyen test middleware : chỉ được gọi khi có token
router.get("/secure", verifyToken, getAllStudents);
// Lấy học sinh theo id
router.get("/:id", getStudentById);

// Thêm học sinh mới
router.post("/", createStudent);

// Cập nhật học sinh
router.put("/:id", updateStudent);

// Xóa học sinh
router.delete("/:id", deleteStudent);

export default router;


