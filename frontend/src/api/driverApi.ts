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

// Lấy tất cả tài xế
export const getAllDrivers = async (): Promise<IDriver[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch drivers');
  return res.json();
};

// Lấy tài xế theo ID
export const getDriverById = async (id: number): Promise<IDriver> => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch driver');
  return res.json();
};

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

// Định dạng chuỗi thô (16 trường):
// MaHS|HoTen|NgaySinh|Lop|TrangThai|TenPH|SDTPH|MaPH|TenDon|DiaChiDon|KinhDoDon|ViDoDon|TenTra|DiaChiTra|KinhDoTra|ViDoTra

// --- INTERFACES ---

/**
 * Interface Chi tiết Học sinh (Đã phân tích cú pháp)
 * Dùng để hiển thị trong SchedulePage và MapPage
 */
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
  
  // Trạm Đón
  pickUpStopName: string;
  pickUpAddress: string;
  pickUpLat: number;    // Vĩ độ
  pickUpLng: number;    // Kinh độ
  
  // Trạm Trả
  dropOffStopName: string;
  dropOffAddress: string;
  dropOffLat: number;   // Vĩ độ
  dropOffLng: number;   // Kinh độ
}


/**
 * Interface cho từng đối tượng Lịch trình trong mảng (Kết quả từ API)
 * studentListRaw chứa chuỗi 16 trường chi tiết học sinh
 */
export interface IScheduleDriver {
  // Thông tin cơ bản
  id: number; // MaLT
  scheduleDate: string; // YYYY-MM-DD
  startTime: string;
  endTime: string | null; 
  // Thông tin Tuyến đường và Xe/Tài xế
  routeStart: string; 
  routeEnd: string; 
  driverName: string;
  busLicensePlate: string; 
  
  // Danh sách học sinh (dữ liệu thô)
  studentListRaw: string; // Chuỗi 16 trường
}


// --- HÀM TIỆN ÍCH PHÂN TÍCH CÚ PHÁP ---

/**
 * Phân tích chuỗi studentListRaw thành mảng các đối tượng IStudentDetail.
 */
export const parseStudentList = (rawString: string): IStudentDetail[] => {
    if (!rawString) return [];
    
    return rawString.split(';').map(item => {
        const [
            name, maHS, dob, studentClass, status, 
            parentName, parentPhone, parentID, 
            pickUpStopName, pickUpAddress, pickUpLng, pickUpLat, 
            dropOffStopName, dropOffAddress, dropOffLng, dropOffLat 
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
            pickUpAddress,
            pickUpLng: parseFloat(pickUpLng),
            pickUpLat: parseFloat(pickUpLat),
            dropOffStopName,
            dropOffAddress,
            dropOffLng: parseFloat(dropOffLng),
            dropOffLat: parseFloat(dropOffLat),
        } as IStudentDetail; 
    });
};


// --- API FUNCTIONS ---

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