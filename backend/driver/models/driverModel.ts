import { pool } from "../../config/db";

export const getAllDrivers = async () => {
  const [rows]: any = await pool.query(
    `SELECT
       TX.MaTX,
       TX.HoTen,
       TX.SoDienThoai,
       TX.BangLai,
       TX.TrangThai,
       TX.Active,
       TK.MaTK,
       TK.TenDangNhap
     FROM TaiXe TX
     JOIN TaiKhoan TK ON TX.MaTK = TK.MaTK
     WHERE TX.Active = 1 AND TK.VaiTro = 3`
  );
  return rows;
};

export const getDriverById = async (id: number) => {
  const [rows]: any = await pool.query(
    `SELECT
       TX.MaTX,
       TX.HoTen,
       TX.SoDienThoai,
       TX.BangLai,
       TX.TrangThai,
       TX.Active,
       TK.MaTK,
       TK.TenDangNhap
     FROM TaiXe TX
     JOIN TaiKhoan TK ON TX.MaTK = TK.MaTK
     WHERE TX.MaTX = ? AND TK.VaiTro = 3`,
    [id]
  );
  return rows[0] || null;
};