// // frontend/api/accountApi.ts

// export interface IAccount {
//   TenDangNhap: string;  // email / username
//   VaiTro: string;       // admin / driver / parent...
//   MaTK: number;         // mã tài khoản (liên kết với Admin/Driver)
// }

// // Lấy account theo id (cần token)
// export const getAccountById = async (id: number, token: string): Promise<IAccount> => {
//   const response = await fetch(`http://localhost:5000/account/${id}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!response.ok) throw new Error("Không thể tải thông tin tài khoản");
//   const data: IAccount = await response.json();
//   return data;
// };

// // Lấy tất cả account
// export const getAllAccounts = async (token: string): Promise<IAccount[]> => {
//   const response = await fetch(`http://localhost:5000/account`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   if (!response.ok) throw new Error("Không thể tải danh sách tài khoản");
//   const data: IAccount[] = await response.json();
//   return data;
// };
export interface IAccount {
  MaTK: number;          // quan trọng: dùng để lấy admin
  TenDangNhap: string;
  VaiTro: number;        // 1,2,3...
}

// Lấy account theo id (cần token)
export const getAccountById = async (id: number, token: string): Promise<IAccount> => {
  const response = await fetch(`http://localhost:5000/account/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Không thể tải thông tin tài khoản");

  const data: IAccount = await response.json();
  return data;
};
