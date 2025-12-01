// routes/noticeRoute.ts
import express from "express";
import { sendNotice, fetchNotices, fetchAllNotices } from "../controllers/noticeController";

const router = express.Router();

// GET  /notice           → lấy tất cả thông báo (cho admin)
router.get("/", fetchAllNotices);

// GET  /notice/123       → lấy thông báo của user 123
router.get("/:MaTK", fetchNotices);

// POST /notice           → gửi thông báo
router.post("/", sendNotice);

export default router;