// frontend/api/scheduleApi.ts
export interface ISchedule {
    id: number;
    Ngay: string;
    GioBatDau: string;
    GioKetThuc: string;
    MaTX: number;
    TenTaiXe: string;
    MaXe: number;
    BienSo: string;
    MaTD: number;
    NoiBatDau: string;
    NoiKetThuc: string;
}

export interface ICreateSchedule {
    Ngay: string;
    GioBatDau: string;
    GioKetThuc: string;
    MaTX: number;
    MaXe: number;
    MaTD: number;
}

// Lấy tất cả lịch trình hôm nay
export const getTodaySchedules = async (): Promise<ISchedule[]> => {
    const response = await fetch("http://localhost:5000/buses/schedule/today");
    if (!response.ok) throw new Error(`Lỗi khi fetch Lịch trình hôm nay: ${response.statusText}`);
    return await response.json();
};

// Lấy lịch trình theo ngày
export const getSchedulesByDate = async (date: string): Promise<ISchedule[]> => {
    const response = await fetch(`http://localhost:5000/buses/schedule/date/${date}`);
    if (!response.ok) throw new Error(`Lỗi khi fetch lịch: ${response.statusText}`);
    return await response.json();
};

// Tạo lịch trình mới
export const createSchedule = async (data: ICreateSchedule, existingSchedules?: ISchedule[]) => {
    if (existingSchedules) {
        const [newHStart, newMStart] = data.GioBatDau.split(":").map(Number);
        const [newHEnd, newMEnd] = data.GioKetThuc.split(":").map(Number);
        const newStartMinutes = newHStart * 60 + newMStart;
        const newEndMinutes = newHEnd * 60 + newMEnd;

        const overlap = existingSchedules.some((sch) => {
            const [sh, sm] = sch.GioBatDau.split(":").map(Number);
            const [eh, em] = sch.GioKetThuc.split(":").map(Number);
            const schStart = sh * 60 + sm;
            const schEnd = eh * 60 + em;

            // Chỉ check trùng tài xế hoặc xe
            const timeConflict = newStartMinutes < schEnd && newEndMinutes > schStart;
            return timeConflict && (sch.MaTX === data.MaTX || sch.MaXe === data.MaXe);
        });

        if (overlap) {
            throw new Error("Xe hoặc tài xế đã có lịch trùng giờ trong ngày!");
        }
    }

    const response = await fetch("http://localhost:5000/buses/schedule/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Lỗi khi lưu lịch trình: ${response.statusText}`);
    return await response.json();
};

// Xóa lịch trình theo ID
export const deleteSchedule = async (id: number) => {
    const response = await fetch(`http://localhost:5000/buses/schedule/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`Lỗi khi xóa lịch trình: ${response.statusText}`);
    return await response.json();
};
