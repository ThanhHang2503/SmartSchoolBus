// backend/bus/busController.ts
import { Request, Response } from "express";
import { getAllBuses, getTodaySchedules } from "../models/busModel";

export const getBuses = async (req: Request, res: Response) => {
  try {
    const buses = await getAllBuses();
    res.json(buses);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách Xe Bus:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const getSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await getTodaySchedules();
    res.json(schedules);
  } catch (err) {
    console.error("Lỗi khi lấy Lịch trình:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};