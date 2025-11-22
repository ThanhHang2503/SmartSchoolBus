// models/noticeModel.ts
import { pool } from "../../config/db";

export const getNoticesByUser = async (MaTK: number) => {
  const [rows]: any = await pool.query(
    `SELECT 
        TB.MaTB, 
        TB.NoiDung, 
        TB.NgayTao, 
        TB.GioTao, 
        CTTB.ThoiGian
     FROM ThongBao TB
     JOIN CTTB ON TB.MaTB = CTTB.MaTB
     WHERE CTTB.MaTK = ?
     ORDER BY CTTB.ThoiGian DESC`,
    [MaTK]
  );
  return rows;
};

export const createNotice = async (NoiDung: string, receivers: number[]) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // Tạo thông báo chính
    const [result]: any = await connection.execute(
      "INSERT INTO ThongBao (NoiDung, NgayTao, GioTao) VALUES (?, CURDATE(), CURTIME())",
      [NoiDung.trim()]
    );
    const MaTB = result.insertId;

    // Chèn chi tiết + ThoiGian ngay lập tức
    if (receivers.length > 0) {
      const values = receivers.map(MaTK => [MaTK, MaTB, new Date()]);
      await connection.query(
        "INSERT INTO CTTB (MaTK, MaTB, ThoiGian) VALUES ?",
        [values]
      );
    }

    await connection.commit();
    return { MaTB, NoiDung, receivers };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};