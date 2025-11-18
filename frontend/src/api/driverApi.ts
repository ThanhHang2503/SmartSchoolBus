// frontend/api/driverApi.ts

// Cấu trúc dữ liệu chi tiết mong muốn trả về từ backend (driverModel)
export interface IDriverDetail {
  id: number; // MaTX
  name: string; // HoTen
  SoDienThoai: string;
  BangLai: string;
  TrangThai: number;
  TenDangNhap: string;
}

/**
 * Lấy danh sách tất cả Tài xế từ backend.
 * Endpoint backend: GET http://localhost:5000/driver
 */
export const getAllDrivers = async (): Promise<IDriverDetail[]> => {
  const response = await fetch("http://localhost:5000/driver");

  if (!response.ok) {
    throw new Error(`Lỗi khi fetch danh sách Tài xế: ${response.statusText}`);
  }
  
  const data: IDriverDetail[] = await response.json();
  return data;
};

/**
 * Lấy thông tin Tài xế theo ID.
 * Endpoint backend: GET http://localhost:5000/driver/:id
 */
export const getDriverById = async (id: number): Promise<IDriverDetail> => {
    const response = await fetch(`http://localhost:5000/driver/${id}`);

    if (!response.ok) {
        throw new Error(`Không tìm thấy Tài xế có ID: ${id}`);
    }
    
    const data: IDriverDetail = await response.json();
    return data;
};