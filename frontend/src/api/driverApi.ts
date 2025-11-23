// frontend/api/driverApi.ts
export interface IDriverDetail {
  id: number;           // ← frontend dùng cái này
  MaTX: number;         // ← backend trả về cái này
  HoTen: string;
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

  const rawData = await response.json();

  // ← ĐOẠN NÀY LÀ "CỨU MẠNG" CỦA BẠN
  return rawData.map((driver: any) => ({
    ...driver,
    id: driver.MaTX,        // ← chuyển MaTX → id để frontend dùng được
  }));
};

/**
 * Lấy thông tin Tài xế theo ID.
 */
export const getDriverById = async (id: number): Promise<IDriverDetail> => {
  const response = await fetch(`http://localhost:5000/driver/${id}`);
  if (!response.ok) {
    throw new Error(`Không tìm thấy Tài xế có ID: ${id}`);
  }

  const rawData = await response.json();

  // Cũng map lại cho đồng bộ
  return {
    ...rawData,
    id: rawData.MaTX,
  };
};