import { pool } from "../../config/database.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

// Interface cho trạm dừng
export interface IStop {
  MaTram: number;
  TenTram: string;
  DiaChi: string;
  KinhDo: number;
  ViDo: number;
}

// Lấy tất cả trạm dừng
export const getAllStops = async (): Promise<IStop[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM TramDung ORDER BY MaTram"
  );
  return rows as IStop[];
};

// Lấy trạm dừng theo ID
export const getStopById = async (id: number): Promise<IStop | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM TramDung WHERE MaTram = ?",
    [id]
  );
  return rows.length > 0 ? (rows[0] as IStop) : null;
};

// Tạo trạm dừng mới
export const createStop = async (stop: Omit<IStop, "MaTram">): Promise<number> => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO TramDung (TenTram, DiaChi, KinhDo, ViDo) VALUES (?, ?, ?, ?)",
    [stop.TenTram, stop.DiaChi, stop.KinhDo, stop.ViDo]
  );
  return result.insertId;
};

// Cập nhật trạm dừng
export const updateStop = async (id: number, stop: Partial<IStop>): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>(
    "UPDATE TramDung SET TenTram = ?, DiaChi = ?, KinhDo = ?, ViDo = ? WHERE MaTram = ?",
    [stop.TenTram, stop.DiaChi, stop.KinhDo, stop.ViDo, id]
  );
  return result.affectedRows > 0;
};

// Xóa trạm dừng
export const deleteStop = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM TramDung WHERE MaTram = ?",
    [id]
  );
  return result.affectedRows > 0;
};
