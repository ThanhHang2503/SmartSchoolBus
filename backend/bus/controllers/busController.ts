// backend/bus/busController.ts
import { Request, Response } from "express";
import { executeQuery } from "../../config/db";
import { getAllBuses, getTodaySchedules, removeSchedule } from "../models/busModel";

// Lấy danh sách xe
export const getBuses = async (req: Request, res: Response) => {
  try {
    const buses = await getAllBuses();
    res.json(buses);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách Xe Bus:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Lấy lịch trình hôm nay
export const getSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await getTodaySchedules();
    res.json(schedules);
  } catch (err) {
    console.error("Lỗi khi lấy Lịch trình:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Tạo lịch trình mới
export const createSchedule = async (req: Request, res: Response) => {
  const { Ngay, GioBatDau, GioKetThuc, MaTX, MaXe, MaTD } = req.body;

  if (!Ngay || !GioBatDau || !GioKetThuc || !MaTX || !MaXe || !MaTD) {
    return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
  }

  try {
    // 1. Kiểm tra trùng
    const existing = await executeQuery(
      `SELECT * FROM LichTrinh
       WHERE Ngay = ? AND MaTX = ? AND MaXe = ? AND MaTD = ?
       AND (
           (GioBatDau <= ? AND GioKetThuc >= ?) OR
           (GioBatDau <= ? AND GioKetThuc >= ?)
       )`,
      [
        Ngay,
        MaTX,
        MaXe,
        MaTD,
        GioBatDau,
        GioBatDau, // check đầu của lịch mới có trong khoảng lịch cũ
        GioKetThuc,
        GioKetThuc, // check cuối của lịch mới có trong khoảng lịch cũ
      ]
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "Lịch trình này trùng giờ với lịch hiện có" });
    }

    // 2. Nếu chưa trùng -> insert
    const result = await executeQuery(
      "INSERT INTO LichTrinh (Ngay, GioBatDau, GioKetThuc, MaTX, MaXe, MaTD) VALUES (?, ?, ?, ?, ?, ?)",
      [Ngay, GioBatDau, GioKetThuc, MaTX, MaXe, MaTD]
    );

    const newId = result.insertId;
    res.json({ id: newId, Ngay, GioBatDau, GioKetThuc, MaTX, MaXe, MaTD });
  } catch (err) {
    console.error("Lỗi khi tạo lịch trình:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Xóa lịch trình theo ID
export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Thiếu ID lịch trình" });
    }

    await removeSchedule(Number(id));
    res.json({ message: "Xóa lịch trình thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa lịch trình:", err);
    res.status(500).json({ message: "Lỗi máy chủ", error: err });
  }
};


