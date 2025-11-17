// backend/bus/busModel.ts
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

// Lấy lịch trình hôm nay, JOIN với Tài xế, Xe Bus, Tuyến đường
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
        WHERE LT.Ngay = CURDATE()` // Lấy lịch trình cho ngày hiện tại
    );
    return rows;
};