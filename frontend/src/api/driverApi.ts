export interface IDriver {
  id: number;
  name: string;
  phone?: string;
  license?: string;
  status?: number;
  username?: string;
}

const BASE_URL = 'http://localhost:5000/drivers'; 
// nhớ đổi port nếu backend bạn chạy khác

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
