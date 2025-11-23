// frontend/api/routesApi.ts

// Cấu trúc dữ liệu chi tiết cho Tuyến Đường
export interface IRouteDetail {
  id: number; // MaTD
  NoiBatDau: string;
  NoiKetThuc: string;
  VanTocTB: number;
  DoDai: number;
}

/**
 * Lấy danh sách tất cả Tuyến Đường từ backend.
 * Endpoint backend: GET http://localhost:5000/route
 * (Giả định endpoint /routes được cấu hình để gọi đến controller/model TuyenDuong)
 */
export const getAllRoutes = async (): Promise<IRouteDetail[]> => {
  const response = await fetch("http://localhost:5000/route");

  if (!response.ok) {
    throw new Error(`Lỗi khi fetch danh sách Tuyến Đường: ${response.statusText}`);
  }
  
  const data: IRouteDetail[] = await response.json();
  return data;
};