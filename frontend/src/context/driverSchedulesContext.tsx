// driverSchedulesContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IScheduleDriver } from '@/api/driverApi'; // Import interface đã định nghĩa

// 1. Định nghĩa Kiểu dữ liệu Context
interface SchedulesContextType {
  schedules: IScheduleDriver[];
  setSchedules: (s: IScheduleDriver[]) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
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

  return (
    <SchedulesContext.Provider value={{ schedules, setSchedules, loading, setLoading }}>
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