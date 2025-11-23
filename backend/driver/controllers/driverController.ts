// backend/driver/driverController.ts
import { Request, Response } from "express";
import { getAllDrivers, getDriverById, getDriverSchedulesByAccountId, getNotificationsByAccountId } from "../models/driverModel";
import { AuthRequest } from "../middleware/verifyToken";
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

// GET /driver/me 

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

//GET /driver/me/schedules
export const getCurrentDriverSchedules = async (req: AuthRequest, res: Response) => {
  try {
    const MaTK = Number(req.user.userId); // Lấy MaTK từ token
    const schedules = await getDriverSchedulesByAccountId(MaTK);

    if (!schedules) return res.status(404).json({ message: "Không tìm thấy lịch trình" });
    res.json(schedules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// GET /driver/me/notifications
export const getDriverNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const maTK = Number(req.user.userId);
    const notifications = await getNotificationsByAccountId(maTK);
    
    if (!notifications) return res.status(404).json({ message: "Không tìm thấy thông báo" });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};