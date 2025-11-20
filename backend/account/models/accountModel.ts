// backend/account/models/accountModel.ts

import { pool } from "../../config/db";

/**
 * Tìm user theo email + password
 * Trả về object có: id (string), email, name, role
 */
export const findUserByCredentials = async (email: string, password: string) => {
  const [rows]: any = await pool.execute(
    `
    SELECT 
      tk.MaTK AS id,
      tk.TenDangNhap AS email,
      tk.VaiTro,
      COALESCE(ph.HoTen, 'Người dùng') AS name
    FROM TaiKhoan tk
    LEFT JOIN PhuHuynh ph ON tk.MaTK = ph.MaTK
    WHERE tk.TenDangNhap = ?
      AND tk.MatKhau = ?
      AND tk.TrangThai = 1
    `,
    [email, password]
  );

  if (rows.length === 0) return null;

  const user = rows[0];

  let role: "parent" | "admin" | "driver" = "parent";
  if (user.VaiTro === 2) role = "admin";
  else if (user.VaiTro === 3) role = "driver";

  return {
    id: user.id.toString(),
    email: user.email,
    name: user.name || "Người dùng",
    role,
  };
};


export { pool };