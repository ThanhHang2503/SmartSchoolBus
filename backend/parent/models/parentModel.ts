// Lấy thông tin phụ huynh và danh sách học sinh theo MaTK
export const getParentAndStudentsByAccountId = async (maTK: number) => {
  // Lấy thông tin phụ huynh
  const [parentRows]: any = await pool.query(
    `SELECT PH.MaPH, PH.HoTen, PH.SoDienThoai, TK.TenDangNhap
     FROM PhuHuynh PH
     JOIN TaiKhoan TK ON PH.MaTK = TK.MaTK
     WHERE PH.MaTK = ? AND TK.VaiTro = 1`,
    [maTK]
  );
  if (!parentRows[0]) return null;
  const parent = parentRows[0];

  // Lấy danh sách học sinh của phụ huynh này
  const [studentRows]: any = await pool.query(
    `SELECT HS.MaHS, HS.HoTen, HS.NgaySinh, HS.Lop, TD_DON.TenTram AS TenTramDon, TD_TRA.TenTram AS TenTramTra
     FROM HocSinh HS
     JOIN TramDung TD_DON ON HS.DiemDon = TD_DON.MaTram
     JOIN TramDung TD_TRA ON HS.DiemTra = TD_TRA.MaTram
     WHERE HS.MaPH = ?`,
    [parent.MaPH]
  );

  return {
    parent: {
      MaPH: parent.MaPH,
      HoTen: parent.HoTen,
      SoDienThoai: parent.SoDienThoai,
      TenDangNhap: parent.TenDangNhap,
    },
    students: studentRows,
  };
};

// Lấy thông báo cho tài khoản (MaTK)
export const getNotificationsByAccountId = async (maTK: number) => {
  const [rows]: any = await pool.query(
    `SELECT TB.MaTB, TB.NoiDung, TB.LoaiTB, CTTB.ThoiGian
     FROM CTTB
     JOIN ThongBao TB ON CTTB.MaTB = TB.MaTB
     WHERE CTTB.MaTK = ?
     ORDER BY CTTB.ThoiGian DESC`,
    [maTK]
  );
  return rows;
};
// backend/parent/parentModel.ts
import { pool } from "../../config/db";

// Lấy tất cả Phụ huynh, JOIN với TaiKhoan để lấy TenDangNhap
export const getAllParents = async () => {
  const [rows]: any = await pool.query(
    `SELECT
       PH.MaPH,
       PH.HoTen,
       PH.SoDienThoai,
       PH.Active,
       TK.MaTK,
       TK.TenDangNhap
     FROM PhuHuynh PH
     JOIN TaiKhoan TK ON PH.MaTK = TK.MaTK
     WHERE PH.Active = 1 AND TK.VaiTro = 1`
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