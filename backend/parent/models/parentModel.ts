// backend/parent/parentModel.ts
import { pool } from "../../config/db";

// Lấy tất cả Phụ huynh, JOIN với TaiKhoan để lấy TenDangNhap
export const getAllParents = async () => {
  const [rows]: any = await pool.query(
    `SELECT 
      PH.MaPH AS id, 
      PH.HoTen AS name,
      PH.SoDienThoai,
      TK.TenDangNhap
    FROM PhuHuynh PH
    JOIN TaiKhoan TK ON PH.MaTK = TK.MaTK 
    WHERE TK.VaiTro = 1` // VaiTro = 1 là Phụ huynh
  );
  return rows;
};

// Lấy Phụ huynh theo ID (MaPH)
export const getParentById = async (id: number) => {
  const [rows]: any = await pool.query(
    `SELECT 
      PH.MaPH AS id, 
      PH.HoTen AS name,
      PH.SoDienThoai,
      TK.TenDangNhap
    FROM PhuHuynh PH
    JOIN TaiKhoan TK ON PH.MaTK = TK.MaTK
    WHERE PH.MaPH = ? AND TK.VaiTro = 1`,
    [id]
  );
  return rows[0];
};