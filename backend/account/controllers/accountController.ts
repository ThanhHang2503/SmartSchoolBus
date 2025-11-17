import type { Request, Response } from "express"
import { findUserByCredentials } from "../models/accountModel.js"

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập đủ thông tin" })
    }

    const user = await findUserByCredentials(email, password)
    if (!user) {
      return res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" })
    }

    res.json({ success: true, user })
  } catch (err) {
    console.error("Lỗi đăng nhập:", err)
    res.status(500).json({ success: false, message: "Lỗi server" })
  }
}
