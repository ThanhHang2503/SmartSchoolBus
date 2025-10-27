// frontend/src/api/studentApi.ts
export interface IStop {
  id: string;
  name?: string;
  lat: number;
  lng: number;
}

export interface IContact {
  name?: string;
  phone?: string;
  email?: string;
}

export interface IStudent {
  id: string;
  name: string;
  grade?: string;
  pickupStop?: IStop;
  dropStop?: IStop;
  parentContact?: IContact;
  notes?: string;
}

const BASE_URL = 'http://localhost:5000/students'; // đổi port nếu backend khác

export const getAllStudents = async (): Promise<IStudent[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch students');
  return res.json();
};
