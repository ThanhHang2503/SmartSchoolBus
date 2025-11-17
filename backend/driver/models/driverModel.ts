// backend/driver/driverModel.ts
import { pool } from "../../config/db";

// Lấy tất cả Tài xế, JOIN với TaiKhoan (sử dụng logic +13 dựa trên dữ liệu mẫu)
export const getAllDrivers = async () => {
  const [rows]: any = await pool.query(
    `SELECT 
      TX.MaTX AS id, 
      TX.HoTen AS name, 
      TX.SoDienThoai, 
      TX.BangLai,
      TX.TrangThai,
      TK.TenDangNhap
    FROM TaiXe TX
    JOIN TaiKhoan TK 
      ON TX.MaTX + 13 = TK.MaTK 
    WHERE TK.VaiTro = 3` // VaiTro = 3 là Tài xế
  );
  return rows;
};

// Lấy Tài xế theo ID (MaTX)
export const getDriverById = async (id: number) => {
  const [rows]: any = await pool.query(
    `SELECT 
      TX.MaTX AS id, 
      TX.HoTen AS name, 
      TX.SoDienThoai, 
      TX.BangLai,
      TX.TrangThai,
      TK.TenDangNhap
    FROM TaiXe TX
    JOIN TaiKhoan TK ON TX.MaTX + 13 = TK.MaTK
    WHERE TX.MaTX = ? AND TK.VaiTro = 3`,
    [id]
  );
  return rows[0];
};