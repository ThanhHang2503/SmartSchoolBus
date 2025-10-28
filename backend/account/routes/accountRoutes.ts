// backend/account/routes/accountRoutes.ts
import express from "express"
import { pool, findUserByCredentials } from "../models/accountModel"

const router = express.Router()

// 📌 GET /account → Lấy toàn bộ user từ DB
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT MaTK AS id, TenDangNhap AS email, VaiTro FROM TaiKhoan")
    res.json(rows)
  } catch (err) {
    console.error("Lỗi khi lấy danh sách tài khoản:", err)
    res.status(500).json({ message: "Lỗi server" })
  }
})

// 📌 POST /account/login → Kiểm tra đăng nhập
router.post("/login", async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await findUserByCredentials(email, password)
    if (user) {
      res.json({ success: true, user })
    } else {
      res.json({ success: false, message: "Sai email hoặc mật khẩu" })
    }
  } catch (err) {
    console.error("Lỗi đăng nhập:", err)
    res.status(500).json({ message: "Lỗi server" })
  }
})

export default router
