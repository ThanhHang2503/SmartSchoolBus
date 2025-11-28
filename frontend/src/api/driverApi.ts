// frontend/src/api/driverApi.ts
// Consolidated driver API used by frontend components
import axios from "axios";
import { parseErrorResponse, isAuthError } from "@/utils/authHelper";

export interface IDriverDetail {
  id: number;           // ← frontend dùng cái này
  MaTX: number;         // ← backend trả về cái này
  MaTK?: number;        // ← Mã tài khoản (để gửi thông báo)
  Active?: number;      // ← Trạng thái active
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

  // Map để đảm bảo có cả id và MaTX với giá trị đúng (đảm bảo là number)
  return rawData.map((driver: any) => {
    const maTX = Number(driver.MaTX || driver.id);
    return {
      ...driver,
      id: maTX,
      MaTX: maTX,
      MaTK: driver.MaTK ? Number(driver.MaTK) : undefined,
      Active: driver.Active ?? 1, // Mặc định Active = 1 nếu không có
      HoTen: driver.HoTen || driver.name,
      SoDienThoai: driver.SoDienThoai || driver.phone,
    };
  });
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
export const getCurrentDriver = async (
  token: string | null,
  onAuthError?: () => void
): Promise<IDriver> => {
  // Validate token
  if (!token || typeof token !== "string" || token.trim() === "") {
    throw new Error("Token không hợp lệ hoặc đã hết hạn");
  }

  try {
    const res = await fetch(`http://localhost:5000/driver/me`, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        "Content-Type": "application/json",
      },
    });
    
    if (!res.ok) {
      // Parse error response
      const errorData = await parseErrorResponse(res);
      
      // Log error với đầy đủ thông tin
      console.error("Backend error response:", {
        status: res.status,
        statusText: res.statusText,
        body: errorData,
        url: res.url,
        headers: Object.fromEntries(res.headers.entries()),
      });
      
      // Handle authentication errors
      if (isAuthError(res.status)) {
        console.warn(`Authentication error (${res.status}): Token invalid or expired`);
        if (onAuthError) {
          onAuthError();
        }
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }
      
      const errorMessage = 
        errorData.message || 
        errorData.error || 
        `Không thể lấy thông tin tài xế (${res.status} ${res.statusText})`;
      throw new Error(errorMessage);
    }
    
    return await res.json();
  } catch (err: any) {
    // Re-throw if already an Error with message
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(`Không thể lấy thông tin tài xế: ${err?.message || "Unknown error"}`);
  }
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
export const getCurrentDriverSchedules = async (
  token: string | null,
  onAuthError?: () => void
): Promise<IScheduleDriver[]> => {
  // Validate token
  if (!token || typeof token !== "string" || token.trim() === "") {
    throw new Error("Token không hợp lệ hoặc đã hết hạn");
  }

  try {
    const res = await fetch(`http://localhost:5000/driver/me/schedules`, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        "Content-Type": "application/json",
      },
    }); 
    
    if (!res.ok) {
      // Parse error response
      const errorData = await parseErrorResponse(res);
      
      // Log error với đầy đủ thông tin
      console.error("Backend error response:", {
        status: res.status,
        statusText: res.statusText,
        body: errorData,
        url: res.url,
      });
      
      // Handle authentication errors
      if (isAuthError(res.status)) {
        console.warn(`Authentication error (${res.status}): Token invalid or expired`);
        if (onAuthError) {
          onAuthError();
        }
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }
      
      const errorMessage = 
        errorData.message || 
        errorData.error || 
        `Không thể lấy thông tin lịch trình của tài xế (${res.status})`;
      throw new Error(errorMessage);
    }
    
    return await res.json();
  } catch (err: any) {
    // Re-throw if already an Error with message
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(`Không thể lấy thông tin lịch trình: ${err?.message || "Unknown error"}`);
  }
};

export interface IDriverNotification {
  id: number;
  message: string;
  date: string; // YYYY-MM-DD HH:MM:SS
  ngayTao?: string;
  gioTao?: string;
  loaiTB?: string; // Loại thông báo
}

//Lấy thông báo của tài xế
export const getDriverNotifications = async (
  token: string | null,
  onAuthError?: () => void
): Promise<IDriverNotification[]> => {
  // Validate token
  if (!token || typeof token !== "string" || token.trim() === "") {
    return []; // Return empty array instead of throwing for notifications
  }

  try {
    const res = await fetch(`http://localhost:5000/driver/me/notifications`, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        "Content-Type": "application/json",
      },
    }); 
    
    if (!res.ok) {
      // Parse error response
      const errorData = await parseErrorResponse(res);
      
      // Log error
      console.error("Backend error response:", {
        status: res.status,
        statusText: res.statusText,
        body: errorData,
      });
      
      // Handle authentication errors
      if (isAuthError(res.status)) {
        console.warn(`Authentication error (${res.status}): Token invalid or expired`);
        if (onAuthError) {
          onAuthError();
        }
        return []; // Return empty array for notifications on auth error
      }
      
      // For other errors, return empty array (notifications are not critical)
      console.warn("Failed to fetch notifications, returning empty array");
      return [];
    }
    
    return await res.json();
  } catch (err: any) {
    console.error("Error fetching notifications:", err);
    return []; // Return empty array on any error
  }
};

// --- Driver location endpoints (live tracking) ---
export const postDriverLocation = async (driverId: number, latitude: number, longitude: number, token?: string) => {
  const res = await fetch(`http://localhost:5000/driver/location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ driverId, latitude, longitude }),
  });
  return res.json();
};

export const getDriverLocation = async (driverId: number) => {
  const res = await fetch(`http://localhost:5000/driver/location/${driverId}`, {
    // prevent cached 304 responses during frequent polling
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache'
    }
  });
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  return data.position ?? null;
};
//cập nhật trạng thái đón/trả học sinh
export const updateStudentStatus = async (
  maHS: number,
  newStatus: number,
  maLT: number
) => {
  const res = await axios.put(`${BASE_URL}/update-status`, {
    maHS,
    status: newStatus,
    maLT
  });
  return res.data;
};

