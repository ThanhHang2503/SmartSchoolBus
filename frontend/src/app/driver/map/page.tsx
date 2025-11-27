"use client";

import MyMap from "@/components/Map";

import React, { useState, useEffect } from "react";
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
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  List,
  ListItem,
  Divider,
  Collapse,
  IconButton,
  Badge
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useDriverSchedules } from '@/context/driverSchedulesContext';
import { IStudentDetail, parseStudentList, updateStudentStatus, IDriverNotification, getDriverNotifications } from "@/api/driverApi";
import { sendNotice } from "@/api/noticeApi";
import { useAuth } from "@/context/AuthContext";

export default function MapAndStudentPage() {
  //LẤY DỮ LIỆU THỰC TẾ
  const { schedules, loading } = useDriverSchedules();
  const { token } = useAuth();
  console.log("schedules:", schedules);
  const [search, setSearch] = useState("");
  
  // State cho thông báo từ admin
  const [notifications, setNotifications] = useState<IDriverNotification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  
  // Lấy thông báo từ admin
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return;
      
      setIsNotificationLoading(true);
      try {
        const data = await getDriverNotifications(token);
        setNotifications(data || []);
      } catch (err) {
        console.error("Lỗi khi lấy thông báo:", err);
        setNotifications([]);
      } finally {
        setIsNotificationLoading(false);
      }
    };
    
    fetchNotifications();
    // Refresh thông báo mỗi 30 giây
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const { refreshSchedules } = useDriverSchedules();
  // Hàm cập nhật trạng thái 
  const handleStatusChange = async (maHS: number, newStatus: number, maLT: number) => {
      try {
          const result = await updateStudentStatus(maHS, newStatus, maLT);
          console.log("OK:", result);
          refreshSchedules(); // Load lại lịch trình thực tế

      } catch (error) {
          console.error("Lỗi cập nhật:", error);
      }
  };

 // LỌC CHUYẾN MỚI THEO THỜI GIAN THỰC
  // Use local date comparison to avoid UTC vs local date mismatch
  const now = new Date();
  const nowTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }); // Lấy HH:MM:SS hiện tại
  // Helper: convert scheduleDate to local date string for safe comparison
  const isSameLocalDate = (dateLike: string) => {
    try {
      const d = new Date(dateLike);
      return d.toDateString() === now.toDateString();
    } catch (e) {
      // fallback: compare YYYY-MM-DD substrings
      const localY = now.getFullYear();
      const localM = String(now.getMonth() + 1).padStart(2, '0');
      const localD = String(now.getDate()).padStart(2, '0');
      const localStr = `${localY}-${localM}-${localD}`;
      return dateLike === localStr;
    }
  };

  const todaySchedules = schedules.filter(s => isSameLocalDate(s.scheduleDate)); // Lấy TẤT CẢ các chuyến trong ngày hôm nay (local)
    console.log("Lịch trình hôm nay:", todaySchedules);
    const activeOrUpcomingTrips = todaySchedules // 2. Lọc và sắp xếp các chuyến chưa hoàn thành hoặc chưa kết thúc
        .sort((a, b) => a.startTime.localeCompare(b.startTime)); // Sắp xếp theo giờ bắt đầu sớm nhất
    console.log("Chuyến hôm nay (chưa kết thúc):", activeOrUpcomingTrips);
    const currentTrip = activeOrUpcomingTrips[0];
    const [selectedRouteId, setSelectedRouteId] = useState(currentTrip ? currentTrip.routeId : 0); // Tuyến đường được chọn
    // PHÂN TÍCH HỌC SINH TỪ CHUYẾN ĐANG CHỌN
    const allStudents: IStudentDetail[] = currentTrip 
        ? parseStudentList(currentTrip.studentListRaw) 
        : [];

    // LỌC THEO TÊN HỌC SINH
    const filteredStudents = allStudents.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );
    
  // GỬI CẢNH BÁO
  const adminIds = [11, 12, 13]; // ID 3 admin cố định
    
  // === State gửi thông báo ===
  const [message, setMessage] = useState("");
  const [selectedParentIds, setSelectedParentIds] = useState<number[]>([]); // mặc định tất cả
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });
  //==== Lấy người nhận ===
  const getReceivers = () => {
    const receivers: number[] = [...adminIds]; // luôn gửi tất cả admin

    if (selectedParentIds.length === allStudents.length) {
    // nếu chưa chọn gì hoặc chọn tất cả
    receivers.push(...allStudents.map(s => s.parentID));
  } else {
    receivers.push(...selectedParentIds);
  }

    return receivers;
  };

  //=== Gửi thông báo ===
  const handleSendNotice = async () => {
  if (!message.trim()) return;

  const receivers = getReceivers();
  if (receivers.length === 0) {
    setSnackbar({ open: true, message: "Chưa có người nhận!", severity: "error" });
    return;
  }

  try {
    await sendNotice(message, receivers);
    setSnackbar({ open: true, message: "Thông báo đã gửi!", severity: "success" });
    setMessage("");
    setSelectedParentIds([]);  // reset về tất cả phụ huynh
  } catch (err: any) {
    console.error(err);
    setSnackbar({ open: true, message: err.message || "Gửi thất bại!", severity: "error" });
  }
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

              {/* 1. Chọn phụ huynh */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="parent-select-label">Chọn phụ huynh</InputLabel>
                <Select
                  labelId="parent-select-label"
                  multiple
                  value={selectedParentIds}
                  onChange={(e) => {
                    const val = e.target.value as number[];
                    if (val.includes(0)) {
                      // chọn tất cả
                      setSelectedParentIds(allStudents.map(s => s.parentID));
                    } else {
                      setSelectedParentIds(val);
                    }
                  }}
                  input={<OutlinedInput label="Chọn phụ huynh" />}
                  renderValue={(selected) => {
                    const selectedIds = selected as number[];
                    if (selectedIds.length === allStudents.length) return "Tất cả phụ huynh";

                    return selectedIds
                      .map((id) => {
                        const student = allStudents.find((s) => s.parentID === id);
                        return student ? `${student.parentName} - con: ${student.name}` : "";
                      })
                      .join(", ");
                  }}
                >
                  <MenuItem value={0}>
                    <Checkbox checked={selectedParentIds.length === allStudents.length} />
                    <ListItemText primary="Tất cả phụ huynh" />
                  </MenuItem>

                  {allStudents.map((s) => (
                    <MenuItem key={s.parentID} value={s.parentID}>
                      <Checkbox checked={selectedParentIds.includes(s.parentID)} />
                      <ListItemText primary={`${s.parentName} - con: ${s.name}`} />
                    </MenuItem>
                  ))}
                  
                </Select>
              </FormControl>

              {/* 2. Nhập nội dung */}
              <TextField
                label="Nội dung chi tiết"
                multiline
                rows={4}
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="Nhập nội dung thông báo..."
              />

              {/* 3. Nút gửi */}
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={handleSendNotice}
                disabled={!message.trim() || selectedParentIds.length === 0}
              >
                Gửi thông báo
              </Button>
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

      {/* THÔNG BÁO TỪ ADMIN */}
      <Box sx={{ mb: 3, mt: 4 }}>
        <Card sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f8fafc",
                },
              }}
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon sx={{ color: "#3b82f6", fontSize: 28 }} />
                </Badge>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
                  Thông báo từ Admin
                </Typography>
                {notifications.length > 0 && (
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    ({notifications.length} thông báo mới)
                  </Typography>
                )}
              </Box>
              <IconButton size="small">
                {isNotificationOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            
            <Collapse in={isNotificationOpen}>
              <Divider />
              {isNotificationLoading ? (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Đang tải thông báo...
                  </Typography>
                </Box>
              ) : notifications.length === 0 ? (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Chưa có thông báo nào
                  </Typography>
                </Box>
              ) : (
                <List
                  sx={{
                    maxHeight: 240, // Chỉ hiển thị khoảng 2 thông báo (mỗi thông báo ~120px)
                    overflowY: "auto",
                    p: 0,
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#f1f5f9",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#cbd5e1",
                      borderRadius: "4px",
                      "&:hover": {
                        background: "#94a3b8",
                      },
                    },
                  }}
                >
                  {notifications.map((notification, index) => (
                    <React.Fragment key={notification.id || index}>
                      <ListItem
                        sx={{
                          flexDirection: "column",
                          alignItems: "flex-start",
                          py: 2,
                          px: 3,
                        }}
                      >
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                          <Box>
                            {notification.loaiTB && (
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  display: "inline-block",
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  backgroundColor: 
                                    notification.loaiTB === "Xe trễ" ? "#fef3c7" :
                                    notification.loaiTB === "Sự cố" ? "#fee2e2" :
                                    "#e0e7ff",
                                  color: 
                                    notification.loaiTB === "Xe trễ" ? "#92400e" :
                                    notification.loaiTB === "Sự cố" ? "#991b1b" :
                                    "#3730a3",
                                  fontWeight: 600,
                                  mb: 0.5,
                                }}
                              >
                                {notification.loaiTB}
                              </Typography>
                            )}
                          </Box>
                          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                            {notification.date 
                              ? new Date(notification.date).toLocaleString("vi-VN", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : notification.ngayTao && notification.gioTao
                              ? `${notification.ngayTao} ${notification.gioTao}`
                              : "Chưa có thời gian"}
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ color: "#1e293b", lineHeight: 1.6 }}>
                          {notification.message}
                        </Typography>
                      </ListItem>
                      {index < notifications.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Collapse>
          </CardContent>
        </Card>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}