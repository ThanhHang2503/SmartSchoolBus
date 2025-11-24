import express from "express";
import { getCurrentAdmin, getAdmins } from "../controllers/adminController";
import { adminMiddleware } from "../../middleware"; // middleware decode JWT

const router = express.Router();

// GET /admin/profile → lấy thông tin admin hiện tại
router.get("/profile", adminMiddleware, getCurrentAdmin);

// GET /admin/all → lấy danh sách tất cả admin (public)
router.get("/all", getAdmins);

export default router;
