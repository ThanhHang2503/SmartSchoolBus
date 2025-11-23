// routes/noticeRoute.ts
import express from "express";
import { sendNotice, fetchNotices } from "../controllers/noticeController";

const router = express.Router();

// GET  /api/notice/123   → lấy thông báo của user 123
router.get("/:MaTK", fetchNotices);

// POST /api/notice       → gửi thông báo
router.post("/", sendNotice);

export default router;