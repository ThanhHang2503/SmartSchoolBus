import { pool } from "../../config/database.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

// Thông báo
export interface INotification {
  MaTB: number;
  NoiDung: string;
  LoaiTB: string;
}

// Chi tiết thông báo (người nhận)
export interface INotificationDetail {
  MaTK: number;
  MaTB: number;
  ThoiGian: Date;
}

// Thông báo với thông tin người nhận
export interface INotificationWithRecipients extends INotification {
  recipients: Array<{
    MaTK: number;
    TenDangNhap: string;
    ThoiGian: Date;
  }>;
}

// Lấy tất cả thông báo
export const getAllNotifications = async (): Promise<INotification[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM ThongBao ORDER BY MaTB DESC"
  );
  return rows as INotification[];
};

// Lấy thông báo theo ID
export const getNotificationById = async (id: number): Promise<INotification | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM ThongBao WHERE MaTB = ?",
    [id]
  );
  return rows.length > 0 ? (rows[0] as INotification) : null;
};

// Lấy thông báo theo tài khoản
export const getNotificationsByAccount = async (maTK: number): Promise<any[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT tb.*, cttb.ThoiGian
     FROM ThongBao tb
     JOIN CTTB cttb ON tb.MaTB = cttb.MaTB
     WHERE cttb.MaTK = ?
     ORDER BY cttb.ThoiGian DESC`,
    [maTK]
  );
  return rows as any[];
};

// Tạo thông báo mới
export const createNotification = async (
  notification: Omit<INotification, "MaTB">
): Promise<number> => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO ThongBao (NoiDung, LoaiTB) VALUES (?, ?)",
    [notification.NoiDung, notification.LoaiTB]
  );
  return result.insertId;
};

// Gửi thông báo đến tài khoản
export const sendNotificationToAccount = async (
  maTB: number,
  maTK: number
): Promise<void> => {
  await pool.query(
    "INSERT INTO CTTB (MaTK, MaTB, ThoiGian) VALUES (?, ?, NOW())",
    [maTK, maTB]
  );
};

// Gửi thông báo đến nhiều tài khoản
export const sendNotificationToAccounts = async (
  maTB: number,
  maTKList: number[]
): Promise<void> => {
  if (maTKList.length === 0) return;
  
  const values = maTKList.map(maTK => [maTK, maTB, new Date()]);
  await pool.query(
    "INSERT INTO CTTB (MaTK, MaTB, ThoiGian) VALUES ?",
    [values]
  );
};

// Gửi thông báo đến tất cả tài khoản theo vai trò
export const sendNotificationByRole = async (
  maTB: number,
  role: number // 1=PhuHuynh, 2=QuanLy, 3=TaiXe
): Promise<void> => {
  await pool.query(
    `INSERT INTO CTTB (MaTK, MaTB, ThoiGian)
     SELECT MaTK, ?, NOW()
     FROM TaiKhoan
     WHERE VaiTro = ? AND TrangThai = 1`,
    [maTB, role]
  );
};

// Xóa thông báo
export const deleteNotification = async (id: number): Promise<boolean> => {
  await pool.query("DELETE FROM CTTB WHERE MaTB = ?", [id]);
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM ThongBao WHERE MaTB = ?",
    [id]
  );
  return result.affectedRows > 0;
};
