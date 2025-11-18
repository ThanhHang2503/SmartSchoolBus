// frontend/api/parentApi.ts (hoặc đặt ở vị trí bạn quản lý API Frontend)

export interface IParentDetail {
  id: number;
  name: string; // HoTen
  SoDienThoai: string;
  TenDangNhap: string;
}

/**
 * Gọi API backend để lấy tất cả phụ huynh
 * Endpoint backend: /parent
 */
export const getAllParents = async (): Promise<IParentDetail[]> => {
  // Giả định backend server đang chạy trên cổng 5000 (như trong server.ts của bạn)
  const response = await fetch("http://localhost:5000/parent"); 
  
  if (!response.ok) {
    throw new Error(`Lỗi fetch Phụ huynh: ${response.statusText}`);
  }
  
  const data: IParentDetail[] = await response.json();
  return data;
};

// Bạn có thể thêm các hàm API khác ở đây nếu cần (ví dụ: getAllDrivers)