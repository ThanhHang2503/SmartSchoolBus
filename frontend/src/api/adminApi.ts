// frontend/api/adminApi.ts
export interface IAdminDetail {
  MaQL: number;
  HoTen: string;
  SoDienThoai: string;
  TrangThai: number;
  TenDangNhap?: string;
}

export const getAdminById = async (token: string): Promise<IAdminDetail> => {
  const res = await fetch(`http://localhost:5000/admin/profile`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || "Không thể lấy thông tin admin");
  }

  return res.json();
};
