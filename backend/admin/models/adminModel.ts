import { pool } from "../../config/db";

export const getAdminByMaTK = async (MaTK: number) => {
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
      WHERE TK.MaTK = ? AND TK.VaiTro = 2`,
    [MaTK]
  );
  return rows[0];
};
