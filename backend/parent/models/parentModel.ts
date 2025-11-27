import { pool } from "../../config/db";

// Lấy thông tin phụ huynh và danh sách học sinh theo MaTK
export const getParentAndStudentsByAccountId = async (maTK: number) => {
  const [parentRows]: any = await pool.query(
    `SELECT PH.MaPH, PH.HoTen, PH.SoDienThoai, TK.TenDangNhap
     FROM PhuHuynh PH
     JOIN TaiKhoan TK ON PH.MaTK = TK.MaTK
     WHERE PH.MaTK = ? AND TK.VaiTro = 1`,
    [maTK]
  );
  if (!parentRows[0]) return null;
  const parent = parentRows[0];

  const [studentRows]: any = await pool.query(
    `SELECT HS.MaHS, HS.HoTen, HS.NgaySinh, HS.Lop, TD_DON.TenTram AS TenTramDon, TD_TRA.TenTram AS TenTramTra
     FROM HocSinh HS
     LEFT JOIN TramDung TD_DON ON HS.DiemDon = TD_DON.MaTram
     LEFT JOIN TramDung TD_TRA ON HS.DiemTra = TD_TRA.MaTram
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
    `SELECT TB.MaTB, 
      TB.NoiDung, 
      DATE_FORMAT(TB.NgayTao, '%Y-%m-%d') AS NgayTao,
      DATE_FORMAT(TB.GioTao, '%H:%i:%s') AS GioTao, 
      DATE_FORMAT(CTTB.ThoiGian, '%Y-%m-%d %H:%i:%s') AS ThoiGian,
      IFNULL(TB.LoaiTB, 'Khác') AS LoaiTB
     FROM CTTB
     JOIN ThongBao TB ON CTTB.MaTB = TB.MaTB
     WHERE CTTB.MaTK = ?
     ORDER BY CTTB.ThoiGian DESC`,
    [maTK]
  );
  return rows;
};

// Lấy tất cả Phụ huynh, JOIN với TaiKhoan để lấy TenDangNhap
export const getAllParents = async () => {
  try {
    // Thử query với Active trước
    const [rows]: any = await pool.query(
      `SELECT
         PH.MaPH AS MaPH,
         PH.HoTen AS HoTen,
         PH.SoDienThoai AS SoDienThoai,
         IFNULL(PH.Active, 1) AS Active,
         TK.MaTK AS MaTK,
         TK.TenDangNhap AS TenDangNhap
       FROM PhuHuynh PH
       INNER JOIN TaiKhoan TK ON PH.MaTK = TK.MaTK
       WHERE TK.VaiTro = 1 AND TK.TrangThai = 1`
    );
    return rows.map((row: any) => ({
      ...row,
      Active: Number(row.Active) || 1, // Đảm bảo là number
    }));
  } catch (err: any) {
    console.error("Lỗi getAllParents:", err);
    // Nếu lỗi do cột Active không tồn tại, thử query không có Active
    if (err.code === 'ER_BAD_FIELD_ERROR' && err.message?.includes('Active')) {
      console.log("Cột Active không tồn tại, sử dụng query không có Active");
      const [rows]: any = await pool.query(
        `SELECT
           PH.MaPH AS MaPH,
           PH.HoTen AS HoTen,
           PH.SoDienThoai AS SoDienThoai,
           1 AS Active,
           TK.MaTK AS MaTK,
           TK.TenDangNhap AS TenDangNhap
         FROM PhuHuynh PH
         INNER JOIN TaiKhoan TK ON PH.MaTK = TK.MaTK
         WHERE TK.VaiTro = 1 AND TK.TrangThai = 1`
      );
      return rows;
    }
    throw err;
  }
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