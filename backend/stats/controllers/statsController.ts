// backend/admin/controllers/statsController.ts (hoặc backend/stats/controllers/statsController.ts)
import { Request, Response } from "express";
import { getTripsPerDayOfWeek } from "../models/statsModel"; // Thay đổi đường dẫn import nếu cần

export const getTripsPerDay = async (req: Request, res: Response) => {
  try {
    const tripData = await getTripsPerDayOfWeek();
    res.json(tripData);
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu số chuyến xe:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};