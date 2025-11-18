// backend/common/models/routeModel.ts (hoặc backend/route/models/routeModel.ts)
import { pool } from "../../config/db";

// Lấy tất cả Tuyến Đường
export const getAllRoutes = async () => {
  const [rows]: any = await pool.query(
    `SELECT 
      MaTD AS id, 
      NoiBatDau, 
      NoiKetThuc, 
      VanTocTB, 
      DoDai
    FROM TuyenDuong`
  );
  return rows;
};

// Lấy Tuyến Đường theo ID
export const getRouteById = async (id: number) => {
  const [rows]: any = await pool.query(
    `SELECT 
      MaTD AS id, 
      NoiBatDau, 
      NoiKetThuc, 
      VanTocTB, 
      DoDai
    FROM TuyenDuong
    WHERE MaTD = ?`,
    [id]
  );
  return rows[0];
};