import { pool } from "../../config/db";

export const getAllManagers = async () => {
  const [rows]: any = await pool.query(
    "SELECT MaQL AS id, HoTen, SoDienThoai, TrangThai FROM QuanLy"
  );
  return rows;
};

export const getManagerById = async (id: number) => {
  const [rows]: any = await pool.query(
    "SELECT MaQL AS id, HoTen, SoDienThoai, TrangThai FROM QuanLy WHERE MaQL = ?",
    [id]
  );
  return rows[0];
};

export { pool };
