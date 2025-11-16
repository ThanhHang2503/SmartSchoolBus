import { pool } from "../../config/db";

// 📌 Lấy toàn bộ danh sách học sinh
export const getAllStudents = async () => {
  const [rows]: any = await pool.query(
    `SELECT MaHS AS id, HoTen, NgaySinh, Lop, MaPH FROM HocSinh`
  );
  return rows;
};

// 📌 Lấy thông tin học sinh theo ID
export const getStudentById = async (id: number) => {
  const [rows]: any = await pool.query(
    `SELECT MaHS AS id, HoTen, NgaySinh, Lop, MaPH FROM HocSinh WHERE MaHS = ?`,
    [id]
  );
  return rows[0];
};

// 📌 Thêm học sinh mới
export const addStudent = async (
  hoTen: string,
  ngaySinh: string,
  lop: string,
  maPH: number
) => {
  const [result]: any = await pool.query(
    `INSERT INTO HocSinh (HoTen, NgaySinh, Lop, MaPH) VALUES (?, ?, ?, ?)`,
    [hoTen, ngaySinh, lop, maPH]
  );
  return { id: result.insertId };
};

// 📌 Cập nhật thông tin học sinh
export const updateStudent = async (
  id: number,
  hoTen: string,
  ngaySinh: string,
  lop: string,
  maPH: number
) => {
  await pool.query(
    `UPDATE HocSinh SET HoTen = ?, NgaySinh = ?, Lop = ?, MaPH = ? WHERE MaHS = ?`,
    [hoTen, ngaySinh, lop, maPH, id]
  );
  return { success: true };
};

// 📌 Xóa học sinh
export const deleteStudent = async (id: number) => {
  await pool.query(`DELETE FROM HocSinh WHERE MaHS = ?`, [id]);
  return { success: true };
};

export { pool };
