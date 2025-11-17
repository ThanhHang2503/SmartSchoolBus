import axios from 'axios';

const API_URL = 'http://localhost:5000/routers';

// export const getRoutes = async () => {
//   const res = await axios.get(API_URL);
//   return res.data;
// };
// định nghĩa kiểu Route bên frontend
export type Route = {
  id: string;
  name: string;
  vehicleNumber: string;
  defaultTime: string;
};

// Lấy tất cả routes
export const getRoutes = async (): Promise<Route[]> => {
  const res = await axios.get(API_URL);
  return res.data as Route[];
};

// Lấy route theo ID
export const getRouteById = async (id: string) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

// Thêm route mới
export const addRoute = async (route: any) => {
  const res = await axios.post(API_URL, route);
  return res.data;
};

// Cập nhật route
export const updateRoute = async (id: string, route: any) => {
  const res = await axios.put(`${API_URL}/${id}`, route);
  return res.data;
};

// Xóa route
export const deleteRoute = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
