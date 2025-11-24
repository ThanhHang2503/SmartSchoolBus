import axios from 'axios';

const API_URL = 'http://localhost:5000/route';

// Tuyến đường - khớp với database backend
export type Route = {
  MaTD: number;           // Mã tuyến đường
  NoiBatDau: string;      // Nơi bắt đầu
  NoiKetThuc: string;     // Nơi kết thúc
  VanTocTB: number;       // Vận tốc TB (km/h)
  DoDai: number;          // Độ dài (km)
};

// Trạm dừng trong tuyến đường
export type StopInRoute = {
  MaTram: number;
  TenTram: string;
  DiaChi: string;
  KinhDo: number;
  ViDo: number;
  ThuTuDung: number;
};

// Tuyến đường với danh sách trạm
export type RouteWithStops = Route & {
  stops: StopInRoute[];
};

// Response từ API
type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

// Lấy tất cả tuyến đường
export const getRoutes = async (): Promise<Route[]> => {
  const res = await axios.get<ApiResponse<Route[]>>(API_URL);
  return res.data.data;
};

// Frontend-friendly route detail type (maps backend `MaTD` to `id`)
export type IRouteDetail = Route & { id: number };

// Backwards-compatible helper used by UI: return routes with `id` field
export const getAllRoutes = async (): Promise<IRouteDetail[]> => {
  const routes = await getRoutes();
  return routes.map((r) => ({ id: r.MaTD, ...r }));
};

// Lấy tuyến đường theo ID
export const getRouteById = async (id: number): Promise<Route> => {
  const res = await axios.get<ApiResponse<Route>>(`${API_URL}/${id}`);
  return res.data.data;
};

// Lấy tuyến đường với danh sách trạm
export const getRouteWithStops = async (id: number): Promise<RouteWithStops | null> => {
  try {
    const res = await axios.get<ApiResponse<RouteWithStops>>(`${API_URL}/${id}/stops`);
    return res.data.data;
  } catch (err: any) {
    // If backend returns 404 (not found), return null so callers can handle it gracefully
    if (err && err.response && err.response.status === 404) {
      return null;
    }
    // Re-throw other errors (network, 500, etc.) so they can be handled upstream
    throw err;
  }
};

// Tạo tuyến đường mới
export const addRoute = async (route: Omit<Route, 'MaTD'>): Promise<{ MaTD: number }> => {
  const res = await axios.post<ApiResponse<{ MaTD: number }>>(API_URL, route);
  return res.data.data;
};

// Cập nhật tuyến đường
export const updateRoute = async (id: number, route: Partial<Omit<Route, 'MaTD'>>): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, route);
};

// Xóa tuyến đường
export const deleteRoute = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

// Thêm trạm vào tuyến đường
export const addStopToRoute = async (data: { MaTram: number; MaTD: number; ThuTuDung: number }): Promise<void> => {
  await axios.post(`${API_URL}/stops`, data);
};

// Xóa trạm khỏi tuyến đường
export const removeStopFromRoute = async (maTD: number, maTram: number): Promise<void> => {
  await axios.delete(`${API_URL}/${maTD}/stops/${maTram}`);
};