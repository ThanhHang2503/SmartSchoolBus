import express from "express";

import { login } from "../controllers/accountController";
import { pool } from "../models/accountModel";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

const router = express.Router();

// POST /account/login → login với JWT
router.post("/login", login);

// GET /account → lấy tất cả tài khoản
router.get("/", async (req, res) => {
  const { pool } = await import("../models/accountModel");
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT MaTK AS id, TenDangNhap AS email, VaiTro FROM TaiKhoan"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// GET /account/:id → lấy tài khoản theo id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT MaTK AS id, TenDangNhap AS email, VaiTro FROM TaiKhoan WHERE MaTK = ?",
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
