import { Request, Response } from "express";
import { createBus, deleteBus, getAllBuses, getBusById, updateBus } from "../models/busModel";

export const getBuses = async (req: Request, res: Response) => {
  try {
    const buses = await getAllBuses();
    res.json(buses);
  } catch (error: any) {
    console.error("Lỗi khi lấy danh sách xe bus:", error.message);
    res.status(500).json({ message: error.message || "Lỗi khi lấy danh sách xe bus" });
  }
};

export const getBus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "ID không hợp lệ" });
  try {
    const bus = await getBusById(id);
    if (!bus) return res.status(404).json({ message: "Không tìm thấy xe bus" });
    res.json(bus);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Lỗi khi lấy dữ liệu xe bus" });
  }
};

export const addBus = async (req: Request, res: Response) => {
  const { BienSo, SoCho, TinhTrang, MaQL } = req.body;
  if (!BienSo || !SoCho) return res.status(400).json({ message: "Biển số và số chỗ là bắt buộc" });
  try {
    const newBusId = await createBus({ BienSo, SoCho, TinhTrang, MaQL });
    res.status(201).json({ message: "Thêm xe bus thành công", MaXe: newBusId });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Lỗi khi thêm xe bus" });
  }
};

export const editBus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "ID không hợp lệ" });
  try {
    const success = await updateBus(id, req.body);
    if (!success) return res.status(404).json({ message: "Không tìm thấy xe bus" });
    res.json({ message: "Cập nhật xe bus thành công" });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Lỗi khi cập nhật xe bus" });
  }
};

export const removeBus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "ID không hợp lệ" });
  try {
    const success = await deleteBus(id);
    if (!success) return res.status(404).json({ message: "Không tìm thấy xe bus" });
    res.json({ message: "Xóa xe bus thành công" });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Lỗi khi xóa xe bus" });
  }
};