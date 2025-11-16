// backend/parent/parentController.ts
import { Request, Response } from "express";
import { getAllParents, getParentById } from "../models/parentModel";

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