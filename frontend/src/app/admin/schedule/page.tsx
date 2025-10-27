'use client';
import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from '@mui/material';

type ScheduleItem = {
  day: string;
  driver: string;
  route: string;
  vehicle: string;
  time: string;
};

type Route = {
  id: string;
  name: string;
  vehicleNumber: string;
  defaultTime: string;
};

const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu'];

const driverList = [
  { id: 'd1', name: 'Tài xế A' },
  { id: 'd2', name: 'Tài xế B' },
  { id: 'd3', name: 'Tài xế C' },
];

const routeList: Route[] = [
  { id: 'r1', name: 'Tuyến A', vehicleNumber: 'Xe 01', defaultTime: '06:30' },
  { id: 'r2', name: 'Tuyến B', vehicleNumber: 'Xe 02', defaultTime: '06:45' },
  { id: 'r3', name: 'Tuyến C', vehicleNumber: 'Xe 03', defaultTime: '07:00' },
];

const ScheduleAssignmentPage = () => {
  const currentWeek = 42;
  const [weekNumber, setWeekNumber] = useState<number>(currentWeek + 1);
  const [applyWeek, setApplyWeek] = useState<number | null>(null);
  const [viewWeek, setViewWeek] = useState<number>(currentWeek);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [previousSchedule, setPreviousSchedule] = useState<ScheduleItem[] | null>(null);

  const [schedule, setSchedule] = useState<ScheduleItem[]>(
    daysOfWeek.map(day => ({
      day,
      driver: '',
      route: '',
      vehicle: '',
      time: '',
    }))
  );

  const handleChange = (index: number, field: keyof ScheduleItem, value: string) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const handleRouteSelect = (index: number, routeName: string) => {
    const route = routeList.find(r => r.name === routeName);
    if (route) {
      handleChange(index, 'route', route.name);
      handleChange(index, 'vehicle', route.vehicleNumber);
      handleChange(index, 'time', route.defaultTime);
    }
  };

  const handleApplySchedule = () => {
    if (!applyWeek) return;
    console.log(`📌 Áp dụng lịch trình từ tuần thứ ${applyWeek}:`, schedule);
    alert(`Lịch trình đã được áp dụng từ tuần thứ ${applyWeek}`);
  };

  const handleReusePrevious = () => {
    if (previousSchedule) {
      setSchedule(previousSchedule);
      alert('Đã sử dụng lại lịch trình tuần trước');
    } else {
      alert('Không có lịch trình tuần trước để sử dụng lại');
    }
  };

  const handleSaveCurrentAsPrevious = () => {
    setPreviousSchedule(schedule);
  };

  const filteredSchedule = selectedDriver
    ? schedule.filter(item => item.driver === selectedDriver)
    : schedule;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        📅 Lịch trình & Phân công
      </Typography>

      <Paper sx={{ padding: 3, marginBottom: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{xs:12,sm:4}}>
            <TextField
              label="Tuần đang xem"
              type="number"
              fullWidth
              value={viewWeek}
              onChange={(e) => setViewWeek(parseInt(e.target.value))}
            />
          </Grid>
          <Grid size={{xs:12,sm:4}}>
            <TextField
              select
              label="Xem lịch trình của tài xế"
              fullWidth
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {driverList.map(driver => (
                <MenuItem key={driver.id} value={driver.name}>
                  {driver.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Lịch trình tuần {viewWeek}
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ngày</TableCell>
              <TableCell>Tài xế</TableCell>
              <TableCell>Tuyến đường</TableCell>
              <TableCell>Số xe</TableCell>
              <TableCell>Thời gian</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSchedule.map((item, index) => (
              <TableRow key={item.day + index}>
                <TableCell>{item.day}</TableCell>
                <TableCell>
                  <TextField
                    select
                    label="Tài xế"
                    value={item.driver}
                    onChange={(e) => handleChange(index, 'driver', e.target.value)}
                    fullWidth
                  >
                    {driverList.map(driver => (
                      <MenuItem key={driver.id} value={driver.name}>
                        {driver.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    label="Tuyến đường"
                    value={item.route}
                    onChange={(e) => handleRouteSelect(index, e.target.value)}
                    fullWidth
                  >
                    {routeList.map(route => (
                      <MenuItem key={route.id} value={route.name}>
                        {route.name} ({route.vehicleNumber})
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.vehicle}
                    disabled
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.time}
                    onChange={(e) => handleChange(index, 'time', e.target.value)}
                    fullWidth
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2}>
          <Grid size={{xs:12,sm:4}}>
            <TextField
              label="Áp dụng từ tuần thứ"
              type="number"
              fullWidth
              value={applyWeek ?? ''}
              onChange={(e) => setApplyWeek(parseInt(e.target.value))}
            />
          </Grid>
          <Grid size={{xs:12,sm:4}}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleApplySchedule}
              disabled={!applyWeek}
            >
              Áp dụng lịch trình
            </Button>
          </Grid>
          <Grid size={{xs:12,sm:4}}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleReusePrevious}
            >
              Sử dụng lại lịch trình tuần trước
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Button variant="text" onClick={handleSaveCurrentAsPrevious}>
            Lưu lịch trình hiện tại làm tuần trước
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ScheduleAssignmentPage;
