// backend/account/routes/accountRoutes.ts
import express from "express";
import { login } from "../controllers/accountController";  

const router = express.Router();

// GET /account → giữ nguyên nếu bạn cần
router.get("/", async (req, res) => {
  const { pool } = await import("../models/accountModel");
  try {
    const [rows] = await pool.query("SELECT MaTK AS id, TenDangNhap AS email, VaiTro FROM TaiKhoan");
    res.json(rows);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách tài khoản:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// POST /account/login → DÙNG CONTROLLER MỚI (CÓ TOKEN)
router.post("/login", login);  // ← CHỈ 1 DÒNG NÀY LÀ XONG!

export default router;