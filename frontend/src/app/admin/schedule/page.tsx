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
import { getBuses } from '@/api/busApi';

const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

// ===== Khai báo kiểu =====
type Bus = {
  id: string;
  plateNumber: string;
  capacity: number;
  status: string;
};

type Trip = { day: string; route: string; vehicle: string; time: string };

// ===== Component =====
const ScheduleAssignmentPage = () => {
  const [busList, setBusList] = useState<Bus[]>([]);
  const [driverList, setDriverList] = useState<string[]>(['Tài xế A', 'Tài xế B', 'Tài xế C']);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [driverSchedules, setDriverSchedules] = useState<Record<string, Trip[]>>({});

  // Lấy dữ liệu từ API khi component mount
  useEffect(() => {
    // lấy dữ liệu
    getBuses()
      .then(setBusList) // bây giờ TypeScript hiểu là Bus[]
      .catch(err => console.error(err));
}, []);


  // Nếu tài xế chưa có lịch thì tạo mới 7 ngày trống
  const schedule = driverSchedules[selectedDriver] || daysOfWeek.map(day => ({
    day,
    vehicle: '',
    route: '',
    time: '',
  }));

  const handleChange = (dayIndex: number, vehicleNumber: string) => {
    const updated = [...schedule];
    const bus = busList.find(b => b.plateNumber === vehicleNumber);

    if (bus) {
      // Map bus -> tuyến và giờ chạy (nếu bạn có dữ liệu tuyến + giờ, thay thế vào đây)
      updated[dayIndex] = {
        day: updated[dayIndex].day,
        vehicle: bus.plateNumber,
        route: `Tuyến của ${bus.plateNumber}`, // placeholder, thay bằng dữ liệu thật nếu có
        time: '08:00', // placeholder, thay bằng dữ liệu thật nếu có
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
            <MenuItem key={driver} value={driver}>
              {driver}
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
                        <MenuItem key={bus.id} value={bus.plateNumber}>
                          {bus.plateNumber}
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
