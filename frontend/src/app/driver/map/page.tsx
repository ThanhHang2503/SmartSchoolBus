"use client";

import MyMap from "@/components/Map";

import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Paper,
  Select,
  FormControl,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useDriverSchedules } from '@/context/driverSchedulesContext';
import { IStudentDetail, parseStudentList } from "@/api/driverApi";
import axios from "axios";



export default function MapAndStudentPage() {
  //LẤY DỮ LIỆU THỰC TẾ
  const { schedules, loading } = useDriverSchedules();

  const [selectedRouteId, setSelectedRouteId] = useState(1); // Tuyến đường được chọn

  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const { refreshSchedules } = useDriverSchedules();
  // Hàm cập nhật trạng thái 
  const handleStatusChange = async (maHS: number, newStatus: number, maLT: number) => {
      try {
          const res = await axios.put("http://localhost:5000/driver/update-status", {
              maLT,
              maHS,
              status: newStatus,
          });
          console.log("OK:", res.data);
          refreshSchedules(); // Load lại lịch trình thực tế

      } catch (error) {
          console.error("Lỗi cập nhật:", error);
      }
  };

 // LỌC CHUYẾN MỚI THEO THỜI GIAN THỰC
    const today = new Date().toISOString().slice(0, 10);
    const nowTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }); // Lấy HH:MM:SS hiện tại
    const todaySchedules = schedules.filter(s => s.scheduleDate === today);// Lấy TẤT CẢ các chuyến trong ngày hôm nay
    const activeOrUpcomingTrips = todaySchedules // 2. Lọc và sắp xếp các chuyến chưa hoàn thành hoặc chưa kết thúc
        .filter(s => {
            return s.endTime === null || s.endTime > nowTime; 
        })
        .sort((a, b) => a.startTime.localeCompare(b.startTime)); // Sắp xếp theo giờ bắt đầu sớm nhất

    const currentTrip = activeOrUpcomingTrips[0];
    
    // PHÂN TÍCH HỌC SINH TỪ CHUYẾN ĐANG CHỌN
    const allStudents: IStudentDetail[] = currentTrip 
        ? parseStudentList(currentTrip.studentListRaw) 
        : [];

    // LỌC THEO TÊN HỌC SINH
    const filteredStudents = allStudents.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

  // GỬI CẢNH BÁO
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertType || !message.trim()) return;

    setSnackbarMessage("Cảnh báo đã được gửi thành công!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);

    console.log("Gửi cảnh báo:", { alertType, message, timestamp: new Date() });

    setAlertType("");
    setMessage("");
  };

  //HÀM RENDER BẢNG HỌC SINH (NỘI TUYẾN)
    const renderStudentTable = (students: IStudentDetail[]) => {
        const getStatusColor = (status: number) => {
            switch (status) {
                case 1: return 'success.main';
                case 2: return 'error.main';
                default: return 'default';
            }
        };

        if (loading) {
            return <Typography sx={{ p: 2 }}>Đang tải dữ liệu học sinh...</Typography>;
        }

        return (
            <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid #ddd' }}>
                <Table size="medium" aria-label="student list table">
                    <TableHead>
                        <TableRow sx={{ bgcolor: "primary.main" }}>
                            <TableCell sx={{ color: "white", fontWeight: 600 }}>STT</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: 600 }}>Tên HS</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: 600 }}>Lớp</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: 600 }}>Phụ huynh</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: 600 }}>Điểm đón</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: 600 }}>Điểm trả</TableCell>
                            <TableCell sx={{ color: "white", fontWeight: 600 }}>Trạng thái</TableCell> 
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student, index) => {
                            const statusColor = getStatusColor(student.status);

                            return (
                                <TableRow
                                    key={student.id}
                                    hover
                                    sx={{ cursor: "pointer" }}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.class}</TableCell>
                                    <TableCell>
                                      <Typography variant="body2">{student.parentName}</Typography>
                                      <Typography variant="caption" color="text.secondary">SĐT: {student.parentPhone}</Typography>
                                    </TableCell>
                                    <TableCell>{student.pickUpStopName}</TableCell>
                                    <TableCell>{student.dropOffStopName}</TableCell>
                                    
                                    {/* CỘT TRẠNG THÁI (SELECT/DROPDOWN) */}
                                    <TableCell sx={{ width: 150 }}>
                                        <FormControl size="small" fullWidth>
                                            <Select
                                                value={student.status}
                                                // Gọi hàm cập nhật API
                                                onChange={(e) => handleStatusChange(student.id, e.target.value as number, currentTrip.id)}
                                                sx={{ 
                                                    fontSize: "0.875rem",
                                                    color: statusColor,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                <MenuItem value={0} sx={{  }}>Chưa đón</MenuItem>
                                                <MenuItem value={1} sx={{}}>Đã đón</MenuItem>
                                                <MenuItem value={2} sx={{ }}>Đã trả</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {students.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    {currentTrip ? "Không tìm thấy học sinh theo tiêu chí tìm kiếm." : "Chưa có học sinh đăng ký cho chuyến này."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };


    if (loading) {
        return <Box sx={{ p: 3 }}><Typography>Đang tải dữ liệu lịch trình...</Typography></Box>;
    }
    // 1. Kiểm tra nếu không có lịch trình nào trong ngày hôm nay
    if (!todaySchedules || todaySchedules.length === 0) {
        return (
            <Box sx={{ p: 3 }}><Typography variant="h6">Hôm nay bạn không có lịch làm việc.</Typography></Box>
        );
    }

    // 2. Nếu có lịch trình (todaySchedules.length > 0), nhưng không có chuyến đi nào đang diễn ra (currentTrip là null/false).
    if (!currentTrip) {
        return (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6">Bạn đã hoàn thành tất cả lịch trình trong ngày hôm nay.</Typography>
            </Box>
        );
    }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="body2" fontWeight={600} gutterBottom>
        Xe buýt: {currentTrip.busLicensePlate}
      </Typography>
      <Typography variant="body2" fontWeight={600} gutterBottom>
       Chuyến: {currentTrip.startTime} - {currentTrip.endTime || "Chưa kết thúc"}
      </Typography>
      <Typography variant="body2" fontWeight={600} gutterBottom>
       Tuyến: {currentTrip.routeStart} → {currentTrip.routeEnd}
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* BẢN ĐỒ*/}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{
              height: 400,
              borderRadius: 3,
              overflow: "hidden",
              border: "2px solid #9e9e9e",
            }}
          >
            <Paper elevation={0} sx={{ height: "100%" }}>
              <MyMap routeId={selectedRouteId} />
            </Paper>
          </Box>
        </Grid>

        {/*GỬI CẢNH BÁO */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2, height: "90%" }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Gửi cảnh báo khẩn
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  select
                  label="Loại cảnh báo"
                  fullWidth
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value)}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="vehicle">Sự cố phương tiện</MenuItem>
                  <MenuItem value="weather">Ảnh hưởng thời tiết</MenuItem>
                  <MenuItem value="student">Sự cố học sinh</MenuItem>
                  <MenuItem value="delay">Trễ giờ</MenuItem>
                  <MenuItem value="other">Khác</MenuItem>
                </TextField>

                <TextField
                  label="Nội dung chi tiết"
                  multiline
                  rows={4}
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="Nhập chi tiết..."
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  fullWidth
                  disabled={!alertType || !message.trim()}
                >
                  Gửi cảnh báo ngay
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* TÌM KIẾM */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Tìm kiếm theo tên học sinh"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
      </Box>

      {/*BẢNG HỌC SINH DÙNG DỮ LIỆU THỰC TẾ (Nội tuyến) */}
            {renderStudentTable(filteredStudents)}

      {/* THÔNG BÁO */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setOpenSnackbar(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}