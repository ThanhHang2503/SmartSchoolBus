// frontend/api/accountApi.ts
export interface IAccount {
  MaTK: number;
  TenDangNhap: string;
  VaiTro: number;
  TrangThai: number;
}

export const getAccountById = async (id: number | string, token: string): Promise<IAccount> => {
  const res = await fetch(`http://localhost:5000/account/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || "Không thể lấy thông tin account");
  }

  return res.json();
};
