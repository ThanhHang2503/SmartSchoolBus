import { Request, Response } from "express";
import { getAllBuses, getBusById } from "../models/busModel";

export const getBuses = async (req: Request, res: Response) => {
  try {
    const buses = await getAllBuses();
    res.json(buses);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách xe bus:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getBus = async (req: Request, res: Response) => {
  try {
    const bus = await getBusById(Number(req.params.id));
    if (!bus) return res.status(404).json({ message: "Không tìm thấy xe bus" });
    res.json(bus);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin xe bus:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
