import express from "express";
import { login } from "../../account/controllers/accountController";
import { pool } from "../../account/models/accountModel";

const router = express.Router();

// POST /account/login → dùng controller login với JWT
router.post("/login", login);

// GET /account/:id → trả thông tin account kèm MaTK
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows]: any = await pool.query(
      `SELECT MaTK, TenDangNhap, VaiTro
       FROM TaiKhoan
       WHERE MaTK = ?`,
      [id]
    );

    if (!rows.length)
      return res.status(404).json({ message: "Không tìm thấy account" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin account:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
