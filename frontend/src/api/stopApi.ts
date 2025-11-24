import axios from 'axios';

const API_URL = 'http://localhost:5000/stop';

export type IStop = {
  MaTram: number;
  TenTram: string;
  DiaChi: string;
  KinhDo: number;
  ViDo: number;
};

export const getAllStops = async (): Promise<IStop[]> => {
  const res = await axios.get<{ success: boolean; message: string; data: IStop[] }>(API_URL);
  return res.data.data;
};

export const createStop = async (stop: Omit<IStop, 'MaTram'>): Promise<{ MaTram: number }> => {
  const res = await axios.post<{ success: boolean; message: string; data: { MaTram: number } }>(API_URL, stop);
  return res.data.data;
};
