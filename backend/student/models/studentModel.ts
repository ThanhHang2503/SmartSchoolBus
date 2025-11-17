// backend/student/studentModel.ts
import { pool } from "../../config/db";

// Lấy tất cả Học sinh, JOIN với Phụ huynh và Trạm dừng
export const getAllStudents = async () => {
  const [rows]: any = await pool.query(
    `SELECT 
      HS.MaHS AS id, 
      HS.HoTen AS name, 
      HS.NgaySinh, 
      HS.Lop,
      PH.HoTen AS TenPhuHuynh,
      TD_DON.TenTram AS TenTramDon,
      TD_TRA.TenTram AS TenTramTra
    FROM HocSinh HS
    JOIN PhuHuynh PH ON HS.MaPH = PH.MaPH
    JOIN TramDung TD_DON ON HS.DiemDon = TD_DON.MaTram
    JOIN TramDung TD_TRA ON HS.DiemTra = TD_TRA.MaTram`
  );
  return rows;
};

// Lấy Học sinh theo ID (MaHS)
export const getStudentById = async (id: number) => {
  const [rows]: any = await pool.query(
    `SELECT 
      HS.MaHS AS id, 
      HS.HoTen AS name, 
      HS.NgaySinh, 
      HS.Lop,
      PH.HoTen AS TenPhuHuynh,
      TD_DON.TenTram AS TenTramDon,
      TD_TRA.TenTram AS TenTramTra
    FROM HocSinh HS
    JOIN PhuHuynh PH ON HS.MaPH = PH.MaPH
    JOIN TramDung TD_DON ON HS.DiemDon = TD_DON.MaTram
    JOIN TramDung TD_TRA ON HS.DiemTra = TD_TRA.MaTram
    WHERE HS.MaHS = ?`,
    [id]
  );
  return rows[0];
};