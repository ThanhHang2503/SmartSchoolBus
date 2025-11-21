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

// Dữ liệu gửi lên backend khi tạo lịch trình
export interface ICreateSchedule {
    Ngay: string;
    GioBatDau: string;
    GioKetThuc: string;
    MaTX: number;
    MaXe: number;
    MaTD: number;
}

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

/**
 * Tạo mới lịch trình
 * Endpoint backend: POST http://localhost:5000/buses/schedule/create
 */
export const createSchedule = async (data: ICreateSchedule) => {
    const response = await fetch("http://localhost:5000/buses/schedule/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Lỗi khi lưu lịch trình: ${response.statusText}`);
    }

    return await response.json();
};

/**
 * Xóa lịch trình theo ID
 * Endpoint backend: DELETE http://localhost:5000/buses/schedule/:id
 */
export const deleteSchedule = async (id: number) => {
    const response = await fetch(`http://localhost:5000/buses/schedule/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`Lỗi khi xóa lịch trình: ${response.statusText}`);
    }

    return await response.json();
};