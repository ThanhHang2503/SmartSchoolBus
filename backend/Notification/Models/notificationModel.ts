import { pool } from "../../config/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

// Thông báo
export interface INotification {
  MaTB: number;
  NoiDung: string;
  NgayTao: Date | string;
  GioTao: Date | string;
  LoaiTB?: string; // Loại thông báo
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
    "SELECT MaTB, NoiDung, NgayTao, GioTao, IFNULL(LoaiTB, 'Khác') AS LoaiTB FROM ThongBao ORDER BY MaTB DESC"
  );
  return rows as INotification[];
};

// Lấy thông báo theo ID
export const getNotificationById = async (id: number): Promise<INotification | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT MaTB, NoiDung, NgayTao, GioTao, IFNULL(LoaiTB, 'Khác') AS LoaiTB FROM ThongBao WHERE MaTB = ?",
    [id]
  );
  return rows.length > 0 ? (rows[0] as INotification) : null;
};

// Lấy thông báo theo tài khoản
export const getNotificationsByAccount = async (maTK: number): Promise<any[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT tb.MaTB, tb.NoiDung, tb.NgayTao, tb.GioTao, IFNULL(tb.LoaiTB, 'Khác') AS LoaiTB, cttb.ThoiGian
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
  notification: { NoiDung: string; LoaiTB?: string }
): Promise<number> => {
  const loaiTB = notification.LoaiTB || 'Khác';
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO ThongBao (NoiDung, NgayTao, GioTao, LoaiTB) VALUES (?, CURDATE(), CURTIME(), ?)",
    [notification.NoiDung, loaiTB]
  );
  return result.insertId;
};

// Gửi thông báo đến tài khoản
export const sendNotificationToAccount = async (
  maTB: number,
  maTK: number
): Promise<void> => {
  await pool.query(
    "INSERT INTO CTTB (MaTK, MaTB, ThoiGian) VALUES (?, ?, CURRENT_TIMESTAMP)",
    [maTK, maTB]
  );
};

// Gửi thông báo đến nhiều tài khoản
export const sendNotificationToAccounts = async (
  maTB: number,
  maTKList: number[],
  excludeMaTK?: number // Loại bỏ MaTK này khỏi danh sách
): Promise<void> => {
  if (maTKList.length === 0) return;
  
  // Loại bỏ người gửi khỏi danh sách
  let filteredList = maTKList;
  if (excludeMaTK) {
    filteredList = maTKList.filter(maTK => maTK !== excludeMaTK);
  }
  
  if (filteredList.length === 0) return;
  
  const values = filteredList.map(maTK => [maTK, maTB, new Date()]);
  await pool.query(
    "INSERT INTO CTTB (MaTK, MaTB, ThoiGian) VALUES ?",
    [values]
  );
};

// Gửi thông báo đến tất cả tài khoản theo vai trò
export const sendNotificationByRole = async (
  maTB: number,
  role: number, // 1=PhuHuynh, 2=QuanLy, 3=TaiXe
  excludeMaTK?: number // Loại bỏ MaTK này khỏi danh sách
): Promise<void> => {
  // Lấy thời gian hiện tại từ JavaScript và format thành MySQL datetime string
  // Format: YYYY-MM-DD HH:MM:SS
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
  const excludeCondition = excludeMaTK ? 'AND TK.MaTK != ?' : '';
  const params = excludeMaTK ? [maTB, currentTime, excludeMaTK] : [maTB, currentTime];
  
  if (role === 1) {
    // Phụ huynh: JOIN với bảng PhuHuynh
    // Theo ssb.sql: PhuHuynh.MaTK = TaiKhoan.MaTK
    // Cột Active được thêm qua ALTER TABLE (dòng 177), có thể chưa tồn tại
    try {
      // Thử query với điều kiện Active = 1
      await pool.query(
        `INSERT INTO CTTB (MaTK, MaTB, ThoiGian)
         SELECT TK.MaTK, ?, ?
         FROM TaiKhoan TK
         INNER JOIN PhuHuynh PH ON TK.MaTK = PH.MaTK
         WHERE TK.VaiTro = 1 
           AND TK.TrangThai = 1 
           AND PH.Active = 1
           ${excludeCondition}`,
        params
      );
    } catch (err: any) {
      // Nếu lỗi do cột Active không tồn tại, thử query không có Active
      if (err.code === 'ER_BAD_FIELD_ERROR' && err.message?.includes('Active')) {
        await pool.query(
          `INSERT INTO CTTB (MaTK, MaTB, ThoiGian)
           SELECT TK.MaTK, ?, ?
           FROM TaiKhoan TK
           INNER JOIN PhuHuynh PH ON TK.MaTK = PH.MaTK
           WHERE TK.VaiTro = 1 AND TK.TrangThai = 1 ${excludeCondition}`,
          params
        );
      } else {
        throw err;
      }
    }
  } else if (role === 2) {
    // Quản lý: JOIN với bảng QuanLy
    // Theo ssb.sql: QuanLy.MaQL + 10 = TaiKhoan.MaTK
    // QuanLy không có cột Active, chỉ có TrangThai
    await pool.query(
      `INSERT INTO CTTB (MaTK, MaTB, ThoiGian)
       SELECT TK.MaTK, ?, ?
       FROM TaiKhoan TK
       INNER JOIN QuanLy QL ON QL.MaQL + 10 = TK.MaTK
       WHERE TK.VaiTro = 2 
         AND TK.TrangThai = 1 
         AND QL.TrangThai = 1 
         ${excludeCondition}`,
      params
    );
  } else if (role === 3) {
    // Tài xế: JOIN với bảng TaiXe
    // Theo ssb.sql: TaiXe.MaTX + 13 = TaiKhoan.MaTK
    // Cột Active được thêm qua ALTER TABLE (dòng 176), có thể chưa tồn tại
    try {
      // Thử query với điều kiện Active = 1
      await pool.query(
        `INSERT INTO CTTB (MaTK, MaTB, ThoiGian)
         SELECT TK.MaTK, ?, ?
         FROM TaiKhoan TK
         INNER JOIN TaiXe TX ON TX.MaTX + 13 = TK.MaTK
         WHERE TK.VaiTro = 3 
           AND TK.TrangThai = 1 
           AND TX.Active = 1
           ${excludeCondition}`,
        params
      );
    } catch (err: any) {
      // Nếu lỗi do cột Active không tồn tại, thử query không có Active
      if (err.code === 'ER_BAD_FIELD_ERROR' && err.message?.includes('Active')) {
        await pool.query(
          `INSERT INTO CTTB (MaTK, MaTB, ThoiGian)
           SELECT TK.MaTK, ?, ?
           FROM TaiKhoan TK
           INNER JOIN TaiXe TX ON TX.MaTX + 13 = TK.MaTK
           WHERE TK.VaiTro = 3 AND TK.TrangThai = 1 ${excludeCondition}`,
          params
        );
      } else {
        throw err;
      }
    }
  }
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
