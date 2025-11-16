import { pool } from "../../config/db";

export const getAllDrivers = async () => {
  const [rows]: any = await pool.query(
    "SELECT MaTX AS id, HoTen, SoDienThoai, TrangThai FROM TaiXe"
  );
  return rows;
};

export const getDriverById = async (id: number) => {
  const [rows]: any = await pool.query(
    "SELECT MaTX AS id, HoTen, SoDienThoai, TrangThai FROM TaiXe WHERE MaTX = ?",
    [id]
  );
  return rows[0];
};

export { pool };
