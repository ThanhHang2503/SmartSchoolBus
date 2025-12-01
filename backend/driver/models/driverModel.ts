// backend/driver/driverModel.ts
import { pool } from "../../config/db";

// Lấy tất cả Tài xế, JOIN với TaiKhoan
export const getAllDrivers = async () => {
  try {
    // Thử query với MaTK trước (nếu cột MaTK đã được UPDATE)
    const [rows]: any = await pool.query(
      `SELECT 
        TX.MaTX,
        TX.HoTen, 
        TX.SoDienThoai, 
        TX.BangLai,
        TX.TrangThai,
        IFNULL(TX.Active, 1) AS Active,
        TK.MaTK,
        TK.TenDangNhap
      FROM TaiXe TX
      INNER JOIN TaiKhoan TK 
        ON TX.MaTK = TK.MaTK 
      WHERE TK.VaiTro = 3 AND TK.TrangThai = 1`
    );
    // Map để đảm bảo có cả id và MaTX
    return rows.map((row: any) => ({
      ...row,
      id: row.MaTX,
      MaTX: row.MaTX,
      MaTK: row.MaTK,
      Active: Number(row.Active) || 1, // Đảm bảo là number
    }));
  } catch (err: any) {
    // Nếu lỗi do cột MaTK chưa được UPDATE, thử query với logic +13
    if (err.code === 'ER_BAD_FIELD_ERROR' && err.message?.includes('MaTK')) {
      try {
        const [rows]: any = await pool.query(
          `SELECT 
            TX.MaTX,
            TX.HoTen, 
            TX.SoDienThoai, 
            TX.BangLai,
            TX.TrangThai,
            IFNULL(TX.Active, 1) AS Active,
            TK.MaTK,
            TK.TenDangNhap
          FROM TaiXe TX
          INNER JOIN TaiKhoan TK 
            ON TX.MaTX + 13 = TK.MaTK 
          WHERE TK.VaiTro = 3 AND TK.TrangThai = 1`
        );
        return rows.map((row: any) => ({
          ...row,
          id: row.MaTX,
          MaTX: row.MaTX,
          MaTK: row.MaTK,
          Active: Number(row.Active) || 1,
        }));
      } catch (fallbackErr: any) {
        // Nếu lỗi do cột Active không tồn tại, thử query không có Active
        if (fallbackErr.code === 'ER_BAD_FIELD_ERROR' && fallbackErr.message?.includes('Active')) {
          const [rows]: any = await pool.query(
            `SELECT 
              TX.MaTX,
              TX.HoTen, 
              TX.SoDienThoai, 
              TX.BangLai,
              TX.TrangThai,
              1 AS Active,
              TK.MaTK,
              TK.TenDangNhap
            FROM TaiXe TX
            INNER JOIN TaiKhoan TK 
              ON TX.MaTX + 13 = TK.MaTK 
            WHERE TK.VaiTro = 3 AND TK.TrangThai = 1`
          );
          return rows.map((row: any) => ({
            ...row,
            id: row.MaTX,
            MaTX: row.MaTX,
            MaTK: row.MaTK,
            Active: 1,
          }));
        }
        throw fallbackErr;
      }
    }
    // Nếu lỗi do cột Active không tồn tại, thử query không có Active
    if (err.code === 'ER_BAD_FIELD_ERROR' && err.message?.includes('Active')) {
      const [rows]: any = await pool.query(
        `SELECT 
          TX.MaTX,
          TX.HoTen, 
          TX.SoDienThoai, 
          TX.BangLai,
          TX.TrangThai,
          1 AS Active,
          TK.MaTK,
          TK.TenDangNhap
        FROM TaiXe TX
        INNER JOIN TaiKhoan TK 
          ON TX.MaTK = TK.MaTK 
        WHERE TK.VaiTro = 3 AND TK.TrangThai = 1`
      );
      return rows.map((row: any) => ({
        ...row,
        id: row.MaTX,
        MaTX: row.MaTX,
        MaTK: row.MaTK,
        Active: 1,
      }));
    }
    throw err;
  }
};

// Lấy Tài xế theo ID (MaTK từ token)
export const getDriverById = async (maTK: number) => {
  try {
    // Thử query với TX.MaTK = TK.MaTK trước (nếu cột MaTK đã được UPDATE)
    let [rows]: any = await pool.query(
      `SELECT 
        TX.MaTX AS id, 
        TX.HoTen AS name, 
        TX.SoDienThoai AS phone, 
        TX.BangLai AS license,
        TX.TrangThai AS status,
        TK.TenDangNhap AS username
      FROM TaiXe TX
      JOIN TaiKhoan TK ON TX.MaTK = TK.MaTK
      WHERE TK.MaTK = ? AND TK.VaiTro = 3 AND TK.TrangThai = 1`,
      [maTK]
    );
    
    // Nếu không tìm thấy và có lỗi về cột MaTK, thử query với logic +13
    if (rows.length === 0) {
      [rows] = await pool.query(
        `SELECT 
          TX.MaTX AS id, 
          TX.HoTen AS name, 
          TX.SoDienThoai AS phone, 
          TX.BangLai AS license,
          TX.TrangThai AS status,
          TK.TenDangNhap AS username
        FROM TaiXe TX
        JOIN TaiKhoan TK ON TX.MaTX + 13 = TK.MaTK
        WHERE TK.MaTK = ? AND TK.VaiTro = 3 AND TK.TrangThai = 1`,
        [maTK]
      );
    }
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0];
  } catch (err: any) {
    // Nếu lỗi do cột MaTK không tồn tại, thử query với logic +13
    if (err.code === 'ER_BAD_FIELD_ERROR' && err.message?.includes('MaTK')) {
      try {
        const [rows]: any = await pool.query(
          `SELECT 
            TX.MaTX AS id, 
            TX.HoTen AS name, 
            TX.SoDienThoai AS phone, 
            TX.BangLai AS license,
            TX.TrangThai AS status,
            TK.TenDangNhap AS username
          FROM TaiXe TX
          JOIN TaiKhoan TK ON TX.MaTX + 13 = TK.MaTK
          WHERE TK.MaTK = ? AND TK.VaiTro = 3 AND TK.TrangThai = 1`,
          [maTK]
        );
        
        if (rows.length === 0) {
          return null;
        }
        
        return rows[0];
      } catch (fallbackErr: any) {
        throw fallbackErr;
      }
    }
    throw err;
  }
};

// Lấy Lịch trình làm việc theo MaTK
export const getDriverSchedulesByAccountId = async (MaTK: number) => {
 const [rows]: any = await pool.query(
  `SELECT
    LT.MaLT AS id,
    LT.MaTD AS routeId,
    DATE_FORMAT(LT.Ngay, '%Y-%m-%d') AS scheduleDate,
    LT.GioBatDau AS startTime,
    LT.GioKetThuc AS endTime,
    TD.NoiBatDau AS routeStart,
    TD.NoiKetThuc AS routeEnd,
    TX.HoTen AS driverName,
    XB.BienSo AS busLicensePlate,
    
    -- Danh sách học sinh tham gia lịch trình 
    -- FORMAT: HoTen|MaHS|NgaySinh|Lop|TrangThai|TenPH|SDTPH|MaPH|TenDon|TenTra|
    GROUP_CONCAT(
      CONCAT(
        HS.HoTen, '|', 
                CTLT.MaHS, '|', 
                DATE_FORMAT(HS.NgaySinh, '%Y-%m-%d'), '|', 
                HS.Lop, '|',                               
                CTLT.TrangThai, '|',
                PH.HoTen, '|', 
                PH.SoDienThoai, '|',
                PH.MaPH, '|',
                TDON.TenTram, '|', 
                TTRA.TenTram
      ) 
      ORDER BY HS.HoTen ASC 
      SEPARATOR ';'
    ) AS studentListRaw

  FROM
    LichTrinh LT
  JOIN TaiXe TX ON LT.MaTX = TX.MaTX
  JOIN TaiKhoan TK ON TX.MaTK = TK.MaTK
  JOIN XeBus XB ON LT.MaXe = XB.MaXe
  JOIN TuyenDuong TD ON LT.MaTD = TD.MaTD
  LEFT JOIN CTLT ON LT.MaLT = CTLT.MaLT
  LEFT JOIN HocSinh HS ON CTLT.MaHS = HS.MaHS
  LEFT JOIN PhuHuynh PH ON HS.MaPH = PH.MaPH 
  LEFT JOIN TramDung TDON ON HS.DiemDon = TDON.MaTram
  LEFT JOIN TramDung TTRA ON HS.DiemTra = TTRA.MaTram

  WHERE
    TK.MaTK = ? 
    
  GROUP BY
    LT.MaLT, LT.Ngay, LT.GioBatDau, LT.GioKetThuc, TD.NoiBatDau, TD.NoiKetThuc, 
    TX.HoTen, XB.BienSo
  ORDER BY
    LT.Ngay DESC, LT.GioBatDau ASC`
 , [MaTK]
);

return rows; 
};


// Lấy thông báo cho tài khoản (MaTK)
export const getNotificationsByAccountId = async (maTK: number) => {
  const [rows]: any = await pool.query(
    `SELECT TB.MaTB AS id, 
      TB.NoiDung AS message, 
      DATE_FORMAT(TB.NgayTao, '%Y-%m-%d') AS ngayTao,
      DATE_FORMAT(TB.GioTao, '%H:%i:%s') AS gioTao,
      DATE_FORMAT(CTTB.ThoiGian, '%Y-%m-%d %H:%i:%s') AS date,
      IFNULL(TB.LoaiTB, 'Khác') AS loaiTB

     FROM CTTB
     JOIN ThongBao TB ON CTTB.MaTB = TB.MaTB
     WHERE CTTB.MaTK = ?
     ORDER BY CTTB.ThoiGian DESC`,
    [maTK]
  );
  // Map để đảm bảo format đúng cho frontend
  return rows.map((row: any) => ({
    id: row.id,
    message: row.message,
    date: row.date || `${row.ngayTao} ${row.gioTao}`,
    ngayTao: row.ngayTao,
    gioTao: row.gioTao,
    loaiTB: row.loaiTB || 'Khác',
  }));
};

// Cập nhật trạng thái học sinh trong lịch trình
export const updateStudentStatus = async (maLT: number, maHS: number, newStatus: number) => {
  const [result]: any = await pool.query(
    `
      UPDATE CTLT
      SET TrangThai = ?
      WHERE MaLT = ? AND MaHS = ?
    `,
    [newStatus, maLT, maHS]
  );

  return result.affectedRows > 0;
};
