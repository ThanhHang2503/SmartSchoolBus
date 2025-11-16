import { pool } from "../../config/db";

export const getAllParents = async () => {
  const [rows]: any = await pool.query(
    "SELECT MaPH AS id, HoTen, SoDienThoai, DiaChi FROM PhuHuynh"
  );
  return rows;
};

export const getParentById = async (id: number) => {
  const [rows]: any = await pool.query(
    "SELECT MaPH AS id, HoTen, SoDienThoai, DiaChi FROM PhuHuynh WHERE MaPH = ?",
    [id]
  );
  return rows[0];
};

export { pool };
