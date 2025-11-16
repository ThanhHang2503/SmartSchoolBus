import { Request, Response } from "express";
import { getAllManagers, getManagerById } from "../models/managerModel";

export const getManagers = async (req: Request, res: Response) => {
  try {
    const managers = await getAllManagers();
    res.json(managers);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách quản lý:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getManager = async (req: Request, res: Response) => {
  try {
    const manager = await getManagerById(Number(req.params.id));
    if (!manager) return res.status(404).json({ message: "Không tìm thấy quản lý" });
    res.json(manager);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin quản lý:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
