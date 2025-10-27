import axios from 'axios';
const API_URL = 'http://localhost:5000/drivers';

export interface Driver {
  id: string;
  name: string;
}

export const getDrivers = async (): Promise<Driver[]> => {
  const res = await axios.get('/drivers');
  return res.data as Driver[];
};
