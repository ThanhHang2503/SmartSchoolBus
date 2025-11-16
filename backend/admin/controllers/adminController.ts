import { Request, Response } from "express";
import { getAllAdmins, getAdminById } from "../models/adminModel";

export const getAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await getAllAdmins(); // Đổi managers thành admins
    res.json(admins);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách quản lý:", err);
    res.status(500).json({ message: "Lỗi máy chủ" }); // Đổi Lỗi server thành Lỗi máy chủ
  }
};

export const getAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await getAdminById(Number(req.params.id));
    if (!admin) return res.status(404).json({ message: "Không tìm thấy quản lý này" }); // Thêm "này"
    res.json(admin);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin quản lý:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};