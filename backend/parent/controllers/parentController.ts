// backend/parent/parentController.ts
import { Request, Response } from "express";
import { getAllParents, getParentById, getParentAndStudentsByAccountId, getNotificationsByAccountId } from "../models/parentModel";
import { pool } from "../../config/db";
import { getDriverPosition } from "../../driver/locationStore";
// Lấy thông tin phụ huynh và học sinh theo MaTK
export const getParentAndStudents = async (req: Request, res: Response) => {
  try {
    const maTK = Number(req.params.maTK);
    if (!maTK) return res.status(400).json({ message: "Thiếu MaTK" });
    const data = await getParentAndStudentsByAccountId(maTK);
    if (!data) return res.status(404).json({ message: "Không tìm thấy phụ huynh với tài khoản này" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const getParents = async (req: Request, res: Response) => {
  try {
    const parents = await getAllParents();
    res.json(parents);
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const getParent = async (req: Request, res: Response) => {
  try {
    const parent = await getParentById(Number(req.params.id));
    if (!parent) return res.status(404).json({ message: "Không tìm thấy Phụ huynh này" });
    res.json(parent);
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Lấy thông báo cho phụ huynh theo MaTK
export const getParentNotifications = async (req: Request, res: Response) => {
  try {
    const maTK = Number(req.params.maTK);
    if (!maTK) return res.status(400).json({ message: "Thiếu MaTK" });
    const notifications = await getNotificationsByAccountId(maTK);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// GET /parent/driver-location/:maTK
export const getDriverLocationForParent = async (req: Request, res: Response) => {
  try {
    const maTK = Number(req.params.maTK);
    if (!maTK) return res.status(400).json({ success: false, message: 'maTK required' });

    // lấy danh sách học sinh của phụ huynh
    const data = await getParentAndStudentsByAccountId(maTK);
    if (!data) return res.status(404).json({ success: false, message: 'Parent not found' });
    const studentIds = (data.students || []).map((s: any) => s.MaHS);
    if (studentIds.length === 0) return res.status(404).json({ success: false, message: 'No students found for parent' });

    // tìm lịch trình hôm nay có chứa 1 trong các học sinh này, ưu tiên giờ sớm nhất
    const [rows]: any = await pool.query(
      `SELECT LT.MaLT, LT.MaTX, TX.MaTK AS DriverAccountId
       FROM LichTrinh LT
       JOIN CTLT ON LT.MaLT = CTLT.MaLT
       JOIN TaiXe TX ON LT.MaTX = TX.MaTX
       WHERE CTLT.MaHS IN (?) AND DATE(LT.Ngay) = CURDATE()
       ORDER BY LT.GioBatDau ASC
       LIMIT 1`,
      [studentIds]
    );

    if (!rows || rows.length === 0) return res.status(404).json({ success: false, message: 'No schedule found for today' });
    const sched = rows[0];

    // driver id used in in-memory store may be driver account id or driver.MaTX depending on frontend; try both
    const driverAccountId = sched.DriverAccountId;
    const driverMaTX = sched.MaTX;

    let pos = getDriverPosition(driverAccountId);
    if (!pos) pos = getDriverPosition(driverMaTX);
    if (!pos) return res.status(404).json({ success: false, message: 'Driver position not found' });

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    return res.json({ success: true, driver: { MaTX: driverMaTX, MaTK: driverAccountId }, position: pos });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};