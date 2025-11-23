// backend/admin/models/statsModel.ts

import { pool } from "../../config/db";

// Hàm lấy số chuyến xe (LichTrinh) theo ngày trong tuần (7 ngày gần nhất)
export const getTripsPerDayOfWeek = async () => {
  const [rows]: any = await pool.query(
    `SELECT
      -- Chuyển đổi DAYOFWEEK (1=CN, 2=T2, ..., 7=T7) thành thứ tự 1=T2, 2=T3, ..., 7=CN
      CASE DAYOFWEEK(Ngay)
        WHEN 1 THEN 7  -- Chủ Nhật = 7
        ELSE DAYOFWEEK(Ngay) - 1 -- Thứ 2 = 1, Thứ 3 = 2, ...
      END AS day_order,
      
      -- Tên ngày hiển thị
      CASE DAYOFWEEK(Ngay)
        WHEN 2 THEN 'T2'
        WHEN 3 THEN 'T3'
        WHEN 4 THEN 'T4'
        WHEN 5 THEN 'T5'
        WHEN 6 THEN 'T6'
        WHEN 7 THEN 'T7'
        WHEN 1 THEN 'CN'
      END AS day,
      
      COUNT(*) AS trips
    FROM LichTrinh
    -- THÊM ĐIỀU KIỆN LỌC: Chỉ lấy lịch trình trong 7 ngày gần nhất (từ 7 ngày trước đến hôm nay)
    WHERE Ngay >= DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND Ngay <= CURDATE()
    GROUP BY day_order, day
    ORDER BY day_order;`
  );
  return rows;
};