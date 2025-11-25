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
      TX.SoDienThoai AS phone, 
      TX.BangLai AS license,
      TX.TrangThai AS status,
      TK.TenDangNhap AS username
    FROM TaiXe TX
    JOIN TaiKhoan TK ON TX.MaTX + 13 = TK.MaTK
    WHERE TX.MaTK = ? AND TK.VaiTro = 3`,
    [id]
  );
  return rows[0];
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
  JOIN XeBus XB ON LT.MaXe = XB.MaXe
  JOIN TuyenDuong TD ON LT.MaTD = TD.MaTD
  LEFT JOIN CTLT ON LT.MaLT = CTLT.MaLT
  LEFT JOIN HocSinh HS ON CTLT.MaHS = HS.MaHS
  LEFT JOIN PhuHuynh PH ON HS.MaPH = PH.MaPH 
  LEFT JOIN TramDung TDON ON HS.DiemDon = TDON.MaTram
  LEFT JOIN TramDung TTRA ON HS.DiemTra = TTRA.MaTram

  WHERE
    TX.MaTK = ? 
    
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
      TB.LoaiTB AS type, 
      DATE_FORMAT(CTTB.ThoiGian, '%Y-%m-%d %H:%i:%s') AS date

     FROM CTTB
     JOIN ThongBao TB ON CTTB.MaTB = TB.MaTB
     WHERE CTTB.MaTK = ?
     ORDER BY CTTB.ThoiGian DESC`,
    [maTK]
  );
  return rows;
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
