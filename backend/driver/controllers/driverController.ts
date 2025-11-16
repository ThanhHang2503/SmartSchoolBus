import { Request, Response } from "express";
import { getAllDrivers, getDriverById } from "../models/driverModel";

export const getDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await getAllDrivers();
    res.json(drivers);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách tài xế:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getDriver = async (req: Request, res: Response) => {
  try {
    const driver = await getDriverById(Number(req.params.id));
    if (!driver) return res.status(404).json({ message: "Không tìm thấy tài xế" });
    res.json(driver);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin tài xế:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
