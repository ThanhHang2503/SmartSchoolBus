import { pool } from "../../config/database.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { IStop } from "../../stop/models/stopModel.js";

// Tuyến đường
export interface IRoute {
  MaTD: number;
  NoiBatDau: string;
  NoiKetThuc: string;
  VanTocTB: number;
  DoDai: number;
}

// Trạm trong tuyến đường (IStop + thứ tự dừng từ bảng CTTD)
export interface IStopInRoute extends IStop {
  ThuTuDung: number;
}

// Tuyến đường với danh sách trạm
export interface IRouteWithStops extends IRoute {
  stops: IStopInRoute[];
}

// Lấy tất cả tuyến đường
export const getAllRoutes = async (): Promise<IRoute[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM TuyenDuong ORDER BY MaTD"
  );
  return rows as IRoute[];
};

// Lấy tuyến đường theo ID
export const getRouteById = async (id: number): Promise<IRoute | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM TuyenDuong WHERE MaTD = ?",
    [id]
  );
  return rows.length > 0 ? (rows[0] as IRoute) : null;
};

// Lấy tuyến đường với danh sách trạm
export const getRouteWithStops = async (id: number): Promise<IRouteWithStops | null> => {
  const route = await getRouteById(id);
  if (!route) return null;

  const [stops] = await pool.query<RowDataPacket[]>(
    `SELECT td.*, cttd.ThuTuDung 
     FROM CTTD cttd
     JOIN TramDung td ON cttd.MaTram = td.MaTram
     WHERE cttd.MaTD = ?
     ORDER BY cttd.ThuTuDung`,
    [id]
  );

  return {
    ...route,
    stops: stops as IStopInRoute[],
  };
};

// Tạo tuyến đường mới
export const createRoute = async (route: Omit<IRoute, "MaTD">): Promise<number> => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO TuyenDuong (NoiBatDau, NoiKetThuc, VanTocTB, DoDai) VALUES (?, ?, ?, ?)",
    [route.NoiBatDau, route.NoiKetThuc, route.VanTocTB, route.DoDai]
  );
  return result.insertId;
};

// Thêm trạm vào tuyến đường
export const addStopToRoute = async (params: { 
  MaTram: number; 
  MaTD: number; 
  ThuTuDung: number 
}): Promise<void> => {
  await pool.query(
    "INSERT INTO CTTD (MaTram, MaTD, MaTramDon, ThuTuDung) VALUES (?, ?, ?, ?)",
    [params.MaTram, params.MaTD, params.MaTram, params.ThuTuDung]
  );
};

// Xóa trạm khỏi tuyến đường
export const removeStopFromRoute = async (maTD: number, maTram: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM CTTD WHERE MaTD = ? AND MaTram = ?",
    [maTD, maTram]
  );
  return result.affectedRows > 0;
};

// Cập nhật tuyến đường
export const updateRoute = async (id: number, route: Partial<IRoute>): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE TuyenDuong SET NoiBatDau = ?, NoiKetThuc = ?, VanTocTB = ?, DoDai = ? WHERE MaTD = ?",
    [route.NoiBatDau, route.NoiKetThuc, route.VanTocTB, route.DoDai, id]
  );
  return result.affectedRows > 0;
};

// Xóa tuyến đường
export const deleteRoute = async (id: number): Promise<boolean> => {
  await pool.query("DELETE FROM CTTD WHERE MaTD = ?", [id]);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM TuyenDuong WHERE MaTD = ?",
    [id]
  );
  return result.affectedRows > 0;
};
