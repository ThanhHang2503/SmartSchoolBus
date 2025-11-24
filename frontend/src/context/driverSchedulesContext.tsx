// driverSchedulesContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { IScheduleDriver, getCurrentDriverSchedules } from '@/api/driverApi'; // Import interface đã định nghĩa

// 1. Định nghĩa Kiểu dữ liệu Context
interface SchedulesContextType {
  schedules: IScheduleDriver[];
  setSchedules: (s: IScheduleDriver[]) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;

  // 👉 Thêm hàm refreshSchedules
  refreshSchedules: () => Promise<void>;
}

// Giá trị mặc định cho Context
const SchedulesContext = createContext<SchedulesContextType | undefined>(undefined);

// 2. Tạo Provider Component
interface SchedulesProviderProps {
  children: ReactNode;
}

export const SchedulesProvider: React.FC<SchedulesProviderProps> = ({ children }) => {
  const [schedules, setSchedules] = useState<IScheduleDriver[]>([]);
  const [loading, setLoading] = useState(false); // Ban đầu không tải

  // 👉 Hàm tải lịch trình từ API
  const refreshSchedules = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Chưa đăng nhập");

      const data = await getCurrentDriverSchedules(token); // gọi API thật
      setSchedules(data);
      
    } catch (error) {
      console.error("Lỗi tải lịch trình:", error);
    } finally {
      setLoading(false);
    }
  };

  // 👉 Tự load khi Provider được tạo
  useEffect(() => {
    refreshSchedules();
  }, []);

  return (
    <SchedulesContext.Provider value={{ schedules, setSchedules, loading, setLoading, refreshSchedules}}>
      {children}
    </SchedulesContext.Provider>
  );
};

// 3. Custom Hook để sử dụng Context
export const useDriverSchedules = () => {
  const context = useContext(SchedulesContext);
  if (context === undefined) {
    throw new Error('useDriverSchedules must be used within a SchedulesProvider');
  }
  return context;
};