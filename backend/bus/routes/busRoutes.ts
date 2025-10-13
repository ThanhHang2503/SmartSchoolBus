// src/routes/BusRoutes.ts

import express from "express";
import {
  createBus,
  deleteBus,
  getAllBuses,
  getBusById,
  updateBus,
} from "../controllers/busController";

const router = express.Router();

// Lấy toàn bộ danh sách xe buýt
router.get("/", getAllBuses);

// Lấy thông tin xe buýt theo ID
router.get("/:id", getBusById);

// Thêm xe buýt mới
router.post("/", createBus);

// Cập nhật thông tin xe buýt
router.put("/:id", updateBus);

// Xóa xe buýt
router.delete("/:id", deleteBus);

export default router;
