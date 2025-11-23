// backend/driver/driverController.ts
import { Request, Response } from "express";
import { getAllDrivers, getDriverById } from "../models/driverModel";

// Lấy tất cả tài xế
export const getDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await getAllDrivers();
    res.json(drivers);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách Tài xế:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Lấy tài xế theo ID 
export const getDriver = async (req: Request, res: Response) => {
  try {
    const driver = await getDriverById(Number(req.params.id));
    if (!driver) return res.status(404).json({ message: "Không tìm thấy Tài xế này" });
    res.json(driver);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin Tài xế:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// CÁC PHẦN BÊN DƯỚI DÙNG TOKEN XÁC THỰC

// GET /driver/me dùng token
import { AuthRequest } from "../middleware/verifyToken";
export const getCurrentDriver = async (req: AuthRequest, res: Response) => {
  try {
    const driverId = Number(req.user.userId); // ← xem có bị NaN không
    const driver = await getDriverById(driverId);
    if (!driver) return res.status(404).json({ message: "Không tìm thấy Tài xế" });
    res.json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

//GET /driver/me/schedules dùng token
import { getDriverSchedulesByAccountId } from "../models/driverModel";
export const getCurrentDriverSchedules = async (req: AuthRequest, res: Response) => {
  try {
    const accountId = Number(req.user.userId); // Lấy MaTK từ token
    const schedules = await getDriverSchedulesByAccountId(accountId);

    if (!schedules) return res.status(404).json({ message: "Không tìm thấy Tài xế" });
    res.json(schedules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

