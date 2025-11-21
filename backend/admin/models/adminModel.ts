import { pool } from "../../config/db";

export const getAllAdmins = async () => {
  const [rows]: any = await pool.query(
    `SELECT 
      QL.MaQL AS id, 
      QL.HoTen, 
      QL.SoDienThoai, 
      QL.TrangThai,
      TK.TenDangNhap,
      TK.MaTK
    FROM QuanLy QL
    JOIN TaiKhoan TK 
      ON QL.MaTK = TK.MaTK
    WHERE TK.VaiTro = 2`
  );
  return rows;
};

export const getAdminById = async (id: number) => {
  const [rows]: any = await pool.query(
    `SELECT 
      QL.MaQL AS id, 
      QL.HoTen, 
      QL.SoDienThoai, 
      QL.TrangThai,
      TK.TenDangNhap,
      TK.MaTK
    FROM QuanLy QL
    JOIN TaiKhoan TK ON QL.MaQL = TK.MaTK
    WHERE QL.MaQL = ? AND TK.VaiTro = 2`,
    [id]
  );
  return rows[0];
};


export const getAdminByUsernameModel = async (username: string) => {
  const [rows]: any = await pool.query(
    `SELECT 
        QL.MaQL AS id, 
        QL.HoTen, 
        QL.SoDienThoai, 
        QL.TrangThai,
        TK.TenDangNhap,
        TK.MaTK
      FROM QuanLy QL
      JOIN TaiKhoan TK ON QL.MaTK = TK.MaTK
      WHERE TK.TenDangNhap = ? AND TK.VaiTro = 2`,
    [username]
  );
  return rows[0];
};

