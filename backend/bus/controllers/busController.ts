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
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Lấy lịch trình hôm nay
export const getSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await getTodaySchedules();
    res.json(schedules);
  } catch (err) {
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
    // 1. Kiểm tra trùng giờ (chỉ tài xế + xe)
    // Overlap logic: two intervals overlap when NOT (existing_end <= new_start OR existing_start >= new_end)
    const existing = await executeQuery(
      `SELECT * FROM LichTrinh
       WHERE Ngay = ?
         AND (MaTX = ? OR MaXe = ?)
         AND NOT (GioKetThuc <= ? OR GioBatDau >= ?)`,
      [Ngay, MaTX, MaXe, GioBatDau, GioKetThuc]
    ) as any[];

    if (existing.length > 0) {
      return res.status(409).json({ message: "Xe hoặc tài xế đã có lịch trùng giờ trong ngày" });
    }

    // 2. Insert nếu không trùng
    const result = await executeQuery(
      "INSERT INTO LichTrinh (Ngay, GioBatDau, GioKetThuc, MaTX, MaXe, MaTD) VALUES (?, ?, ?, ?, ?, ?)",
      [Ngay, GioBatDau, GioKetThuc, MaTX, MaXe, MaTD]
    ) as any;

    const newId = result.insertId;
    res.json({ id: newId, Ngay, GioBatDau, GioKetThuc, MaTX, MaXe, MaTD });
  } catch (err) {
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
    res.status(500).json({ message: "Lỗi máy chủ", error: err });
  }
};

// Phân công học sinh cho lịch trình
export const assignStudentsToSchedule = async (req: Request, res: Response) => {
  const { scheduleId, studentIds } = req.body;

  // Validate
  if (!scheduleId || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
    return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc: scheduleId và studentIds (mảng có ít nhất 1 học sinh)" });
  }

  try {
    // 1. Kiểm tra scheduleId có tồn tại không
    const scheduleCheck = await executeQuery(
      "SELECT MaLT FROM LichTrinh WHERE MaLT = ?",
      [scheduleId]
    ) as any[];

    if (scheduleCheck.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy lịch trình với ID này" });
    }

    // 2. Kiểm tra tất cả studentIds có tồn tại không
    const placeholders = studentIds.map(() => "?").join(",");
    const studentsCheck = await executeQuery(
      `SELECT MaHS FROM HocSinh WHERE MaHS IN (${placeholders})`,
      studentIds
    ) as any[];

    if (studentsCheck.length !== studentIds.length) {
      return res.status(400).json({ message: "Một hoặc nhiều học sinh không tồn tại" });
    }

    // 3. Xóa các phân công cũ (nếu có)
    await executeQuery(
      "DELETE FROM CTLT WHERE MaLT = ?",
      [scheduleId]
    );

    // 4. Thêm các phân công mới
    const insertPromises = studentIds.map((studentId: number) =>
      executeQuery(
        "INSERT INTO CTLT (MaLT, MaHS, TrangThai) VALUES (?, ?, 0)",
        [scheduleId, studentId]
      )
    );

    await Promise.all(insertPromises);

    res.json({ 
      message: "Phân công học sinh thành công",
      scheduleId,
      assignedCount: studentIds.length
    });
  } catch (err: any) {
    console.error("Lỗi khi phân công học sinh:", err);
    res.status(500).json({ message: "Lỗi máy chủ", error: err.message });
  }
};