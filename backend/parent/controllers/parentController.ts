// backend/parent/parentController.ts
import { Request, Response } from "express";
import { getAllParents, getParentById, getParentAndStudentsByAccountId, getNotificationsByAccountId } from "../models/parentModel";
// Lấy thông tin phụ huynh và học sinh theo MaTK
export const getParentAndStudents = async (req: Request, res: Response) => {
  try {
    const maTK = Number(req.params.maTK);
    if (!maTK) return res.status(400).json({ message: "Thiếu MaTK" });
    const data = await getParentAndStudentsByAccountId(maTK);
    if (!data) return res.status(404).json({ message: "Không tìm thấy phụ huynh với tài khoản này" });
    res.json(data);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin phụ huynh và học sinh:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const getParents = async (req: Request, res: Response) => {
  try {
    const parents = await getAllParents();
    res.json(parents);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách Phụ huynh:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const getParent = async (req: Request, res: Response) => {
  try {
    const parent = await getParentById(Number(req.params.id));
    if (!parent) return res.status(404).json({ message: "Không tìm thấy Phụ huynh này" });
    res.json(parent);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin Phụ huynh:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Lấy thông báo cho phụ huynh theo MaTK
export const getParentNotifications = async (req: Request, res: Response) => {
  try {
    const maTK = Number(req.params.maTK);
    if (!maTK) return res.status(400).json({ message: "Thiếu MaTK" });
    const notifications = await getNotificationsByAccountId(maTK);
    res.json(notifications);
  } catch (err) {
    console.error("Lỗi khi lấy thông báo:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};