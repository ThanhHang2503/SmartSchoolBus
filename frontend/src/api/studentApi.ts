// frontend/api/studentApi.ts

// Cấu trúc dữ liệu chi tiết cho Học Sinh (JOIN với Phụ huynh và Trạm dừng)
export interface IStudentDetail {
  id: number; // MaHS
  name: string; // HoTen
  NgaySinh: string; // DATE
  Lop: string;
  TenPhuHuynh: string;
  TenTramDon: string;
  TenTramTra: string;
}

/**
 * Lấy danh sách tất cả Học sinh từ backend.
 * Endpoint backend: GET http://localhost:5000/students
 */
export const getAllStudents = async (): Promise<IStudentDetail[]> => {
  const response = await fetch("http://localhost:5000/students");

  if (!response.ok) {
    throw new Error(`Lỗi khi fetch danh sách Học sinh: ${response.statusText}`);
  }
  
  const data: IStudentDetail[] = await response.json();
  return data;
};