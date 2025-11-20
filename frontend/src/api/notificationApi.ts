import axios from 'axios';

const API_URL = 'http://localhost:5000/notifications';

// Thông báo
export type Notification = {
  MaTB: number;
  NoiDung: string;
  LoaiTB: string;
  ThoiGian?: string;
};

// Response từ API
type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

// Lấy tất cả thông báo
export const getAllNotifications = async (): Promise<Notification[]> => {
  const res = await axios.get<ApiResponse<Notification[]>>(API_URL);
  return res.data.data;
};

// Lấy thông báo theo tài khoản
export const getNotificationsByAccount = async (maTK: number): Promise<Notification[]> => {
  const res = await axios.get<ApiResponse<Notification[]>>(`${API_URL}/account/${maTK}`);
  return res.data.data;
};

// Tạo và gửi thông báo
export const createNotification = async (data: {
  NoiDung: string;
  LoaiTB: string;
  recipients?: number[];
  role?: number;
}): Promise<{ MaTB: number }> => {
  const res = await axios.post<ApiResponse<{ MaTB: number }>>(API_URL, data);
  return res.data.data;
};

// Xóa thông báo
export const deleteNotification = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
