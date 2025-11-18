// frontend/api/busApi.ts

// Cấu trúc dữ liệu Xe Bus
export interface IBusDetail {
  id: number; // MaXe
  BienSo: string;
  SoCho: number;
  TinhTrang: number;
  TenQuanLy: string;
}

// Cấu trúc dữ liệu Lịch Trình (Schedules)
export interface ISchedule {
    id: number; // MaLT
    Ngay: string;
    GioBatDau: string;
    GioKetThuc: string;
    TenTaiXe: string;
    BienSo: string;
    NoiBatDau: string;
    NoiKetThuc: string;
}

/**
 * Lấy danh sách tất cả Xe Bus.
 * Endpoint backend: GET http://localhost:5000/buses/info
 * (Sử dụng endpoint /info vì đã cấu hình trong busRoutes.ts)
 */
export const getAllBuses = async (): Promise<IBusDetail[]> => {
  const response = await fetch("http://localhost:5000/buses/info");

  if (!response.ok) {
    throw new Error(`Lỗi khi fetch danh sách Xe Bus: ${response.statusText}`);
  }
  
  const data: IBusDetail[] = await response.json();
  return data;
};

/**
 * Lấy tất cả Lịch trình hôm nay.
 * Endpoint backend: GET http://localhost:5000/buses/schedule/today
 */
export const getTodaySchedules = async (): Promise<ISchedule[]> => {
    const response = await fetch("http://localhost:5000/buses/schedule/today");

    if (!response.ok) {
        throw new Error(`Lỗi khi fetch Lịch trình hôm nay: ${response.statusText}`);
    }
    
    const data: ISchedule[] = await response.json();
    return data;
};