// backend/driver/driverController.ts
import { Request, Response } from "express";
import { getAllDrivers, getDriverById } from "../models/driverModel";

export const getDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await getAllDrivers();
    res.json(drivers);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách Tài xế:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

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