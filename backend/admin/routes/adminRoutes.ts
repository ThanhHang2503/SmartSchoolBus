import express from "express";
import { getCurrentAdmin } from "../controllers/adminController";
import { adminMiddleware } from "../../middleware"; // middleware decode JWT

const router = express.Router();

// GET /admin/profile → lấy thông tin admin hiện tại
router.get("/profile", adminMiddleware, getCurrentAdmin);

export default router;
