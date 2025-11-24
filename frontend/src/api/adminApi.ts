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

export const getAllAdmins = async (): Promise<Array<{ MaQL: number; HoTen: string; MaTK: number; TrangThai: number }>> => {
  const res = await fetch(`http://localhost:5000/admin/all`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Không thể lấy danh sách admin");
  }
  return res.json();
};
