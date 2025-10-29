import mysql from "mysql2/promise"

// Kết nối MySQL (chỉ cần 1 lần)
export const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "root",   // ĐÃ SỬA: ĐÚNG MẬT KHẨU
  database: "SSB",
  port: 3306
});

// Hàm kiểm tra tài khoản
export const findUserByCredentials = async (email: string, password: string) => {
  const [rows]: any = await pool.execute(
    `SELECT MaTK AS id, TenDangNhap AS email, MatKhau AS password, VaiTro 
     FROM TaiKhoan 
     WHERE TenDangNhap = ? AND MatKhau = ? AND TrangThai = 1`,
    [email, password]
  )

  if (rows.length === 0) return null

  const user = rows[0]
  let role = ""
  if (user.VaiTro === 1) role = "parent"
  else if (user.VaiTro === 2) role = "admin"
  else if (user.VaiTro === 3) role = "driver"

  return {
    id: user.id,
    email: user.email,
    role,
  }
}
