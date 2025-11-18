// frontend/api/adminApi.ts

// Cấu trúc dữ liệu chi tiết cho Admin/Quản lý
export interface IAdminDetail {
    id: number; // MaQL
    HoTen: string;
    SoDienThoai: string;
    TrangThai: number;
    TenDangNhap: string;
    MaTK: number;
  }
  
  /**
   * Lấy danh sách tất cả Admin/Quản lý từ backend.
   * Endpoint backend: GET http://localhost:5000/admin
   */
  export const getAllAdmins = async (): Promise<IAdminDetail[]> => {
    const response = await fetch("http://localhost:5000/admin");
  
    if (!response.ok) {
      throw new Error(`Lỗi khi fetch danh sách Admin/Quản lý: ${response.statusText}`);
    }
    
    const data: IAdminDetail[] = await response.json();
    return data;
  };