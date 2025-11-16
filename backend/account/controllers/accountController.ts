import { findUserByCredentials } from "../models/accountModel";
import type { Request, Response } from "express";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập đủ thông tin" });
      return;
    }

    const user = await findUserByCredentials(email, password);
    if (!user) {
      res
        .status(401)
        .json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
      return;
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
