// frontend/api/adminApi.ts

export interface IAdminDetail {
  id: number;
  HoTen: string;
  SoDienThoai: string;
  TrangThai: number;
  TenDangNhap: string;
  MaTK: number;
}

// Lấy tất cả admin
export const getAllAdmins = async (): Promise<IAdminDetail[]> => {
  const response = await fetch("http://localhost:5000/admin");
  if (!response.ok) throw new Error(`Lỗi khi fetch danh sách Admin: ${response.statusText}`);
  const data: IAdminDetail[] = await response.json();
  return data;
};

// Lấy admin theo ID (cần token)
export const getAdminById = async (id: number, token: string): Promise<IAdminDetail> => {
  const response = await fetch(`http://localhost:5000/admin/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Không thể tải thông tin admin");
  const data: IAdminDetail = await response.json();
  return data;
};
