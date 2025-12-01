import { findUserByCredentials } from "../models/accountModel";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ssb10_2025_ok_done";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await findUserByCredentials(email, password);

    if (!user) {
      res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
      return;
    }

    // TẠO TOKEN – DÒNG QUAN TRỌNG NHẤT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        VaiTro: user.VaiTro,
        MaTX: user.MaTX || null,
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    // TRẢ VỀ TOKEN + USER
    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,                    // ← PHẢI CÓ DÒNG NÀY
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        MaTX: user.MaTX || undefined, // Thêm MaTX cho driver
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};