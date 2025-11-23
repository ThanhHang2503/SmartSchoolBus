import { pool } from "../../config/db";

// Lấy tất cả Xe Bus, JOIN với Quản lý
export const getAllBuses = async () => {
  const [rows]: any = await pool.query(
    `SELECT 
      XB.MaXe AS id, 
      XB.BienSo, 
      XB.SoCho, 
      XB.TinhTrang,
      QL.HoTen AS TenQuanLy
    FROM XeBus XB
    JOIN QuanLy QL ON XB.MaQL = QL.MaQL`
  );
  return rows;
};

// Lấy lịch trình hôm nay
export const getTodaySchedules = async () => {
  const [rows]: any = await pool.query(
    `SELECT
        LT.MaLT AS id,
        LT.Ngay,
        LT.GioBatDau,
        LT.GioKetThuc,
        TX.HoTen AS TenTaiXe,
        XB.BienSo,
        TD.NoiBatDau,
        TD.NoiKetThuc
    FROM LichTrinh LT
    JOIN TaiXe TX ON LT.MaTX = TX.MaTX
    JOIN XeBus XB ON LT.MaXe = XB.MaXe
    JOIN TuyenDuong TD ON LT.MaTD = TD.MaTD
    WHERE LT.Ngay = CURDATE()`
  );
  return rows;
};

// Lấy lịch trình theo ngày bất kỳ
export const getSchedulesByDate = async (date: string) => {
  const [rows]: any = await pool.query(
    `SELECT
        LT.MaLT AS id,
        LT.Ngay,
        LT.GioBatDau,
        LT.GioKetThuc,
        TX.HoTen AS TenTaiXe,
        XB.BienSo,
        TD.NoiBatDau,
        TD.NoiKetThuc
    FROM LichTrinh LT
    JOIN TaiXe TX ON LT.MaTX = TX.MaTX
    JOIN XeBus XB ON LT.MaXe = XB.MaXe
    JOIN TuyenDuong TD ON LT.MaTD = TD.MaTD
    WHERE LT.Ngay = ?`,
    [date]
  );
  return rows;
};

// Thêm lịch trình mới
export const insertSchedule = async ({ Ngay, GioBatDau, GioKetThuc, MaTX, MaXe, MaTD }: any) => {
  const [result]: any = await pool.query(
    "INSERT INTO LichTrinh (Ngay, GioBatDau, GioKetThuc, MaTX, MaXe, MaTD) VALUES (?, ?, ?, ?, ?, ?)",
    [Ngay, GioBatDau, GioKetThuc, MaTX, MaXe, MaTD]
  );
  return { id: result.insertId, Ngay, GioBatDau, GioKetThuc, MaTX, MaXe, MaTD };
};

// Xóa lịch trình theo ID
export const removeSchedule = async (id: number) => {
  await pool.query("DELETE FROM LichTrinh WHERE MaLT = ?", [id]);
};
