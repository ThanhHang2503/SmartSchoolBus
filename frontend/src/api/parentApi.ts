// frontend/api/parentApi.ts (hoặc đặt ở vị trí bạn quản lý API Frontend)

export interface IParentDetail {
  id: number;
  MaPH?: number;
  MaTK?: number;        // ← Mã tài khoản (để gửi thông báo)
  Active?: number;      // ← Trạng thái active
  name?: string;        // HoTen (alias)
  HoTen?: string;       // HoTen
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
  
  const rawData: any[] = await response.json();
  
  // Map để đảm bảo có đầy đủ thông tin
  return rawData.map((parent: any) => ({
    id: parent.MaPH || parent.id,
    MaPH: parent.MaPH,
    MaTK: parent.MaTK ? Number(parent.MaTK) : undefined,
    Active: parent.Active ?? 1, // Mặc định Active = 1 nếu không có
    name: parent.HoTen || parent.name,
    HoTen: parent.HoTen || parent.name,
    SoDienThoai: parent.SoDienThoai,
    TenDangNhap: parent.TenDangNhap,
  }));
};

