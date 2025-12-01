// backend/account/models/accountModel.ts

import { pool } from "../../config/db";

export const findUserByCredentials = async (email: string, password: string) => {
  const [rows]: any = await pool.execute(
    `
    SELECT 
      tk.MaTK AS id,
      tk.TenDangNhap AS email,
      tk.VaiTro,
      COALESCE(ph.HoTen, tx.HoTen, ql.HoTen, 'Người dùng') AS name,
      tx.MaTX AS MaTX
    FROM TaiKhoan tk
    LEFT JOIN PhuHuynh ph ON tk.MaTK = ph.MaTK
    -- Some DB seeds map TaiKhoan.MaTK to TaiXe.MaTX + 13, so join using expression
    LEFT JOIN TaiXe     tx ON tk.MaTK = tx.MaTX + 13
    -- Some DB seeds map TaiKhoan.MaTK to QuanLy.MaQL + 10, so join using expression
    LEFT JOIN QuanLy    ql ON ql.MaQL + 10 = tk.MaTK
    WHERE tk.TenDangNhap = ?
      AND tk.MatKhau = ?
      AND tk.TrangThai = 1
    `,
    [email, password]
  );

  if (rows.length === 0) return null;

  const user = rows[0];

  let roleText: "parent" | "admin" | "driver" = "parent";
  if (user.VaiTro === 2) roleText = "admin";
  if (user.VaiTro === 3) roleText = "driver";

  return {
    id: user.id.toString(),
    email: user.email,
    name: user.name || "Người dùng",
    role: roleText,    // TEXT
    VaiTro: user.VaiTro, // SỐ THẬT — QUAN TRỌNG
    MaTX: user.MaTX || null, // Mã tài xế (chỉ có khi là driver)
  };
};
export { pool };

