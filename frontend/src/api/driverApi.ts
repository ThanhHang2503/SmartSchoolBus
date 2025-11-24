// frontend/src/api/driverApi.ts
// Consolidated driver API used by frontend components

export interface IDriverDetail {
  id: number;      // frontend id mapped from MaTX
  MaTX: number;
  HoTen: string;
  SoDienThoai: string;
  BangLai: string;
  TrangThai: number;
  TenDangNhap: string;
}

export interface IDriver {
  id: number;
  name: string;
  phone?: string;
  license?: string;
  status?: number;
  username?: string;
}

const BASE_URL = 'http://localhost:5000/driver';

export const getAllDrivers = async (): Promise<IDriverDetail[]> => {
  const res = await fetch(`${BASE_URL}`);
  if (!res.ok) throw new Error(`Lỗi khi fetch danh sách Tài xế: ${res.statusText}`);
  const raw = await res.json();
  // Map backend MaTX -> id for frontend convenience
  return raw.map((d: any) => ({ ...d, id: d.MaTX }));
};

export const getDriverById = async (id: number): Promise<IDriverDetail> => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error(`Không tìm thấy Tài xế có ID: ${id}`);
  const d = await res.json();
  return { ...d, id: d.MaTX };
};

export const getCurrentDriver = async (token: string): Promise<IDriver> => {
  const res = await fetch(`${BASE_URL}/me`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Không thể lấy thông tin tài xế');
  const d = await res.json();
  return {
    id: d.MaTX ?? d.id,
    name: d.HoTen ?? d.name,
    phone: d.SoDienThoai ?? d.phone,
    license: d.BangLai ?? d.license,
    status: d.TrangThai ?? d.status,
    username: d.TenDangNhap ?? d.username,
  };
};

// Schedule / student parsing types & helpers
export interface IStudentDetail {
  id: number; // MaHS
  name: string;
  dob: string;
  class: string;
  status: number;
  parentID: number;
  parentName: string;
  parentPhone: string;
  pickUpStopName: string;
  dropOffStopName: string;
}

export interface IScheduleDriver {
  id: number; // MaLT
  scheduleDate: string; // YYYY-MM-DD
  startTime: string;
  endTime: string | null;
  routeStart: string;
  routeEnd: string;
  driverName: string;
  busLicensePlate: string;
  studentListRaw: string;
}

export const parseStudentList = (rawString: string): IStudentDetail[] => {
  if (!rawString) return [];
  return rawString.split(';').map((item) => {
    const [
      name,
      maHS,
      dob,
      studentClass,
      status,
      parentName,
      parentPhone,
      parentID,
      pickUpStopName,
      dropOffStopName,
    ] = item.split('|');
    return {
      id: parseInt(maHS || '0'),
      name: name || '',
      dob: dob || '',
      class: studentClass || '',
      status: parseInt(status || '0'),
      parentID: parseInt(parentID || '0'),
      parentName: parentName || '',
      parentPhone: parentPhone || '',
      pickUpStopName: pickUpStopName || '',
      dropOffStopName: dropOffStopName || '',
    } as IStudentDetail;
  });
};

export const getCurrentDriverSchedules = async (token: string): Promise<IScheduleDriver[]> => {
  const res = await fetch(`${BASE_URL}/me/schedules`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Không thể lấy thông tin lịch trình của tài xế');
  return res.json();
};

export interface IDriverNotification {
  id: number;
  message: string;
  type: string;
  date: string; // YYYY-MM-DD HH:MM:SS
}

export const getDriverNotifications = async (token: string): Promise<IDriverNotification[]> => {
  const res = await fetch(`${BASE_URL}/me/notifications`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error('Không thể lấy thông báo của tài xế');
  return res.json();
};