import { pool } from "../../config/db";

export const getAllDrivers = async () => {
  const [rows]: any = await pool.query(
    `SELECT
       TX.MaTX,
       TX.HoTen,
       TX.SoDienThoai,
       TX.BangLai,
         TX.TrangThai,
       TK.MaTK,
       TK.TenDangNhap
     FROM TaiXe TX
     JOIN TaiKhoan TK ON TX.MaTK = TK.MaTK
       WHERE TX.TrangThai = 1 AND TK.VaiTro = 3`
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
       TK.MaTK,
       TK.TenDangNhap
     FROM TaiXe TX
     JOIN TaiKhoan TK ON TX.MaTK = TK.MaTK
     WHERE TX.MaTX = ? AND TK.VaiTro = 3`,
    [id]
  );
  return rows[0] || null;
};


// Lấy Lịch trình làm việc theo MaTK
export const getDriverSchedulesByAccountId = async (MaTK: number) => {
 const [rows]: any = await pool.query(
  `SELECT
    LT.MaLT AS id, 
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

