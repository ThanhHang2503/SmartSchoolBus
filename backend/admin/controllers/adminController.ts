import { Request, Response } from "express";
import { getAdminByMaTK } from "../models/adminModel";
import { getAllAdmins } from "../models/adminModel";

// Lấy thông tin admin hiện tại từ token
export const getCurrentAdmin = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user; // middleware auth sẽ gắn user từ token

    if (!user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    const admin = await getAdminByMaTK(user.userId); // userId từ token
    if (!admin) return res.status(404).json({ message: "Không tìm thấy admin này" });

    res.json(admin);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin admin:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getAdmins = async (_req: Request, res: Response) => {
  try {
    const admins = await getAllAdmins();
    res.json(admins || []);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách admin:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
