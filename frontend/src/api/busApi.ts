// frontend/api/busApi.ts

// Cấu trúc dữ liệu Xe Bus
export interface IBus {
  id: number; // MaXe
  BienSo: string;
  SoCho: number;
  TinhTrang: number;
  TenQuanLy: string;
}


/**
 * Lấy danh sách tất cả Xe Bus.
 * Endpoint backend: GET http://localhost:5000/buses/info
 * (Sử dụng endpoint /info vì đã cấu hình trong busRoutes.ts)
 */
export const getAllBuses = async (): Promise<IBus[]> => {
  const response = await fetch("http://localhost:5000/buses/info");

  if (!response.ok) {
    throw new Error(`Lỗi khi fetch danh sách Xe Bus: ${response.statusText}`);
  }
  
  const data: IBus[] = await response.json();
  return data;
};

