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

    if (!response.ok) {
        throw new Error(`Không tìm thấy Tài xế có ID: ${id}`);
    }
    
    const data: IDriverDetail = await response.json();
    return data;
};
//frontend\src\api\driverApi.ts
export interface IDriver {
  id: number;
  name: string;
  phone?: string;
  license?: string;
  status?: number;
  username?: string;
}

const BASE_URL = 'http://localhost:5000/driver'; 


// Lấy thông tin tài xế hiện tại dựa trên token
export const getCurrentDriver = async (token: string): Promise<IDriver> => {
  const res = await fetch(`http://localhost:5000/driver/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Không thể lấy thông tin tài xế");
  return res.json();
};

// --- LỊCH TRÌNH TÀI XẾ ---
//  Interface Chi tiết Học sinh 
export interface IStudentDetail {
  // Thông tin Học sinh
  id: number;           // MaHS
  name: string;
  dob: string;          // NgaySinh (YYYY-MM-DD)
  class: string;        // Lop
  status: number;       // TrangThai (0: Chưa đón, 1: Đã đón, 2: Đã trả)
  
  // Thông tin Phụ huynh
  parentID: number;     // MaPH (Dùng để gửi thông báo)
  parentName: string;
  parentPhone: string;
  
  pickUpStopName: string; // Trạm Đón
  dropOffStopName: string; // Trạm Trả
}

// Interface cho từng đối tượng Lịch trình trong mảng (Kết quả từ API)
export interface IScheduleDriver {
  id: number;
  routeId: number; // MaLT
  scheduleDate: string; // YYYY-MM-DD
  startTime: string;
  endTime: string | null; 
  // Thông tin Tuyến đường và Xe/Tài xế
  routeStart: string; 
  routeEnd: string; 
  driverName: string;
  busLicensePlate: string; 
  // Danh sách học sinh (dữ liệu thô)
  studentListRaw: string; 
}

 // Phân tích chuỗi studentListRaw thành mảng các đối tượng IStudentDetail.
export const parseStudentList = (rawString: string): IStudentDetail[] => {
    if (!rawString) return [];
    
    return rawString.split(';').map(item => {
        const [
            name, maHS, dob, studentClass, status, 
            parentName, parentPhone, parentID, 
            pickUpStopName, 
            dropOffStopName
        ] = item.split('|');

        return {
            id: parseInt(maHS),
            name,
            dob,
            class: studentClass,
            status: parseInt(status),
            parentID: parseInt(parentID),
            parentName,
            parentPhone,
            pickUpStopName,
            dropOffStopName,
        } as IStudentDetail; 
    });
};

// Lấy lịch trình tài xế hiện tại dựa trên token
export const getCurrentDriverSchedules = async (token: string): Promise<IScheduleDriver[]> => {
 const res = await fetch(`http://localhost:5000/driver/me/schedules`, {
  headers: {
   Authorization: `Bearer ${token}`,
  },
 }); 
 if (!res.ok) throw new Error("Không thể lấy thông tin lịch trình của tài xế");
 return res.json();
};

export interface IDriverNotification {
  id: number;
  message: string;
  type: string;
  date: string; // YYYY-MM-DD HH:MM:SS
}

export const getDriverNotifications = async (token: string): Promise<IDriverNotification[]> => {
  const res = await fetch(`http://localhost:5000/driver/me/notifications`, {
    headers: {
   Authorization: `Bearer ${token}`,
  },
 }); 
 if (!res.ok) throw new Error("Không thể lấy thông báo của tài xế");
 return res.json();
};