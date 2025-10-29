// src/api/busApi.ts
import axios from "axios";
const API_URL = 'http://localhost:5000/buses';

export interface Bus {
  id: string;
  plateNumber: string;
  capacity: number;
  status: string;
}

export const getBuses = async (): Promise<Bus[]> => {
  const res = await axios.get(API_URL);
    console.log(res.data); // kiểm tra dữ liệu backend trả về
  return res.data as Bus[]; // ép kiểu dữ liệu
};
