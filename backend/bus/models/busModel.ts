import { pool } from "../../config/db";

export const getAllBuses = async () => {
  const [rows]: any = await pool.query(
    "SELECT MaXe AS id, BienSo, SoCho, TinhTrang, MaQL FROM XeBus"
  );
  return rows;
};

export const getBusById = async (id: number) => {
  const [rows]: any = await pool.query(
    "SELECT MaXe AS id, BienSo, SoCho, TinhTrang, MaQL FROM XeBus WHERE MaXe = ?",
    [id]
  );
  return rows[0];
};

export { pool };
