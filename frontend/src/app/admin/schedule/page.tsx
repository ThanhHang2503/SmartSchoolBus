// schedule.tsx (Tên component là ScheduleAssignmentPage)
'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem,
  Button,
  Divider,
} from '@mui/material';
// Imports API
import { getAllBuses, IBusDetail } from '@/api/busApi'; 
import { getAllDrivers, IDriverDetail } from '@/api/driverApi'; // Import Driver API

const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

// ===== Khai báo kiểu (Dựa trên IBusDetail từ busApi) =====
// IBusDetail từ busApi: id, BienSo, SoCho, TinhTrang, TenQuanLy
type Bus = {
  id: number; // Đổi từ string sang number (MaXe)
  plateNumber: string; // BienSo
  capacity: number; // SoCho
  status: number; // TinhTrang (0 hoặc 1)
};

// Kiểu dữ liệu Trip giữ nguyên
type Trip = { day: string; route: string; vehicle: string; time: string };

// ===== Component =====
const ScheduleAssignmentPage = () => {
  // Thay đổi kiểu dữ liệu BusList để khớp với IBusDetail
  const [busList, setBusList] = useState<IBusDetail[]>([]);
  
  // driverList lấy từ API, dùng HoTen
  const [driverList, setDriverList] = useState<IDriverDetail[]>([]); 
  
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [driverSchedules, setDriverSchedules] = useState<Record<string, Trip[]>>({});

  // Lấy dữ liệu từ API khi component mount
  useEffect(() => {
    // 1. Lấy danh sách Xe Bus
    getAllBuses()
      .then(data => setBusList(data))
      .catch(err => console.error("Lỗi lấy danh sách xe bus:", err));

    // 2. Lấy danh sách Tài xế
    getAllDrivers()
        .then(data => setDriverList(data))
        .catch(err => console.error("Lỗi lấy danh sách tài xế:", err));
  }, []);


  // Nếu tài xế chưa có lịch thì tạo mới 7 ngày trống
  const schedule = driverSchedules[selectedDriver] || daysOfWeek.map(day => ({
    day,
    vehicle: '',
    route: '',
    time: '',
  }));

  const handleChange = (dayIndex: number, vehiclePlate: string) => {
    const updated = [...schedule];
    // Tìm xe dựa trên biển số
    const bus = busList.find(b => b.BienSo === vehiclePlate); 

    if (bus) {
      // Giả lập tuyến đường và giờ chạy dựa trên xe được chọn
      updated[dayIndex] = {
        day: updated[dayIndex].day,
        vehicle: bus.BienSo, // Sử dụng BienSo (plateNumber)
        route: `Tuyến số ${bus.id}`, // Sử dụng ID xe làm ID tuyến giả lập
        time: '08:00', // placeholder
      };
    } else {
      // Nếu xóa chọn, reset
      updated[dayIndex] = { ...updated[dayIndex], vehicle: '', route: '', time: '' };
    }

    setDriverSchedules(prev => ({
      ...prev,
      [selectedDriver]: updated,
    }));
  };

  const handleSave = () => {
    if (!selectedDriver) return alert('Vui lòng chọn tài xế trước khi lưu.');
    console.log(`📦 Lịch của ${selectedDriver}:`, schedule);
    // TODO: GỌI API ĐỂ LƯU LỊCH TRÌNH VÀO BẢNG LichTrinh VÀ CTTD
    alert(`✅ Đã lưu lịch trình cho ${selectedDriver}`);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        🚌 Phân công lịch trình theo tài xế
      </Typography>

      {/* Chọn tài xế */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          select
          fullWidth
          label="Chọn tài xế để xếp lịch"
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
        >
          <MenuItem value="">-- Chọn tài xế --</MenuItem>
          {driverList.map(driver => (
            // Giá trị là Tên tài xế (HoTen)
            <MenuItem key={driver.id} value={driver.name}>
              {driver.name} ({driver.SoDienThoai})
            </MenuItem>
          ))}
        </TextField>
      </Paper>

      {/* Bảng xếp lịch */}
      {selectedDriver && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Lịch trình của {selectedDriver}
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ngày</TableCell>
                <TableCell>Số xe</TableCell>
                <TableCell>Tuyến đường</TableCell>
                <TableCell>Giờ chạy</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedule.map((trip, dayIndex) => (
                <TableRow key={trip.day}>
                  <TableCell>{trip.day}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      fullWidth
                      value={trip.vehicle}
                      onChange={(e) => handleChange(dayIndex, e.target.value)}
                    >
                      <MenuItem value="">-- Chọn số xe --</MenuItem>
                      {busList.map(bus => (
                        // Key là MaXe, Value là Biển số (BienSo)
                        <MenuItem key={bus.id} value={bus.BienSo}>
                          {bus.BienSo} ({bus.TinhTrang === 1 ? 'Hoạt động' : 'Bảo trì'})
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField fullWidth value={trip.route} disabled />
                  </TableCell>
                  <TableCell>
                    <TextField fullWidth value={trip.time} disabled />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Divider sx={{ my: 2 }} />
          <Button variant="contained" color="primary" onClick={handleSave}>
            💾 Lưu lịch cho {selectedDriver}
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default ScheduleAssignmentPage;