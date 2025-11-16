import express from "express";
import { getAdmins, getAdmin } from "../controllers/adminController";

const router = express.Router();

// 📌 GET /admin → lấy tất cả
router.get("/", getAdmins);

// 📌 GET /admin/:id → lấy theo ID
router.get("/:id", getAdmin);

export default router;