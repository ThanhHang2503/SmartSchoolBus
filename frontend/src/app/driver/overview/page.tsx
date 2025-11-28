"use client"
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { IDriver, getCurrentDriver, parseStudentList, getCurrentDriverSchedules, IDriverNotification, getDriverNotifications} from "@/api/driverApi";
import { useDriverSchedules } from '@/context/driverSchedulesContext';

export default function DriverDashboard() {

  // 1. GỌI TẤT CẢ CÁC HOOKS LÊN TRÊN CÙNG
  const { token } = useAuth(); // Hook 1: Lấy token
  const [driver, setDriver] = useState<IDriver | null>(null); // Hook 2: State cục bộ cho driver
  const { setSchedules, setLoading, schedules, loading } = useDriverSchedules(); //Hook 3: GỌI useDriverSchedules MỘT LẦN DUY NHẤT để lấy cả setters và data
  const [studentStats, setStudentStats] = useState({ total: 0, pickedUp: 0 }); // TRẠNG THÁI TÍNH TOÁN CỤC BỘ
  //Thông báo
  const [notifications, setNotifications] = useState<IDriverNotification[]>([]);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);

  // 2. EFFECT CHO DỮ LIỆU TỪ BACKEND
  // useEffect 1: Lấy thông tin tài xế
  const { logout } = useAuth();
  
  useEffect(() => {
    if (!token) return;

    const fetchDriver = async () => {
      try {
        const data = await getCurrentDriver(token, () => {
          // Handle auth error: clear token and redirect
          logout();
        });
        console.log("Data từ backend:", data); 
        setDriver(data);
      } catch (err: any) {
        console.error("Lỗi khi lấy thông tin tài xế:", err);
        // If it's an auth error, logout will be called by getCurrentDriver
        // For other errors, just log them
        if (err?.message?.includes("hết hạn") || err?.message?.includes("đăng nhập")) {
          // Auth error already handled by getCurrentDriver callback
          return;
        }
      }
    };

    fetchDriver();
  }, [token, logout]);

  // useEffect 2: Lấy lịch trình và lưu vào Global State
  useEffect(() => {
    if (!token) return;   
    const fetchAndCacheSchedules = async () => {
      setLoading(true);
      try {
        const data = await getCurrentDriverSchedules(token, () => {
          // Handle auth error: clear token and redirect
          logout();
        });
        // CẬP NHẬT DỮ LIỆU VÀO GLOBAL STATE
        setSchedules(data); 
      } catch (err: any) {
        console.error("Lỗi khi lấy lịch trình:", err);
        // If it's an auth error, logout will be called by getCurrentDriverSchedules
        if (err?.message?.includes("hết hạn") || err?.message?.includes("đăng nhập")) {
          // Auth error already handled, don't set empty schedules
          return;
        }
        setSchedules([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchAndCacheSchedules();
  }, [token, setSchedules, setLoading, logout]);

  // useEffect 3: Lấy thông báo cho tài xế (DÙNG API MỚI)
 useEffect(() => {
   const fetchNotifications = async () => {
   if (!token) return; 
      
      setIsNotificationLoading(true);
   try {
    const data = await getDriverNotifications(token, () => {
      // Handle auth error: clear token and redirect
      logout();
    }); 
    setNotifications(data); 
    
   } catch (err) {
    console.error("Lỗi khi lấy thông báo:", err);
    setNotifications([]);
   } finally {
    setIsNotificationLoading(false);
   }
   };
   fetchNotifications();
 }, [token, logout]);

  // 3. LOGIC TÍNH TOÁN (Chạy khi schedules thay đổi)
  const today = new Date().toISOString().slice(0, 10); 
  const todaySchedules = schedules.filter(s => s.scheduleDate === today);

  useEffect(() => {
    if (loading) return;

    let totalStudents = 0;
    let pickedUpStudents = 0;

    todaySchedules.forEach(schedule => {
        const students = parseStudentList(schedule.studentListRaw);// Phân tích chuỗi học sinh cho mỗi chuyến
        totalStudents += students.length;

        // Đếm học sinh Đã đón (Trạng thái = 1) và Đã trả (Trạng thái = 2)
        students.forEach(student => {
            if (student.status === 1 || student.status === 2) {
                pickedUpStudents += 1;
            }
        });
    });

    setStudentStats({ total: totalStudents, pickedUp: pickedUpStudents });

  }, [schedules, loading, todaySchedules.length]); // Re-run khi schedules load xong hoặc thay đổi

  // 4. KIỂM TRA ĐIỀU KIỆN 
  if (!driver) return <Typography>Đang tải thông tin tài xế...</Typography>;
  

  // Hàm hiển thị chi tiết từng chuyến làm việc (giờ và tuyến đường)
  const renderScheduleDetails = () => {
    if (loading) {
      return <Typography variant="body2" sx={{ paddingLeft: '24px' }}>Đang tải lịch làm việc...</Typography>;
    }
    if (todaySchedules.length === 0) {
      return <Typography variant="body2" sx={{ paddingLeft: '24px' }}>Hôm nay không có lịch làm việc.</Typography>;
    }
    // Sử dụng .map để lặp qua từng lịch trình
    return todaySchedules.map((schedule, index) => (
      // Áp dụng thụt lề cho Typography
      <Typography key={schedule.id} variant="body2"> 
        Chuyến {index + 1}: {schedule.startTime} - {schedule.endTime || 'Kết thúc'} 
        <span style={{ display: 'block', color: '#555', fontSize: '0.9em' }}>
          ({schedule.routeStart} → {schedule.routeEnd})
        </span>
      </Typography>
    ));
  };

  const busLicensePlate = todaySchedules.length > 0 ? todaySchedules[0].busLicensePlate : "Chưa xác định";

  // hàm xem chi tiết thông báo
  const handleViewDetails = () => { setIsNotificationDialogOpen(true); };

  // 5. RENDER JSX
  return (
    <Box sx={{ 
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "2fr 1fr"}, //trái 2 phần phải 1 phần
      gap: 3,
      alignItems: "flex-start",
    }}>

      {/* cột trái - các thẻ thống kê */}
      <Box sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr"}, //2 cot
        gap: 2,
      }}>
        {/* Lịch làm việc */}
        <Card sx={{ bgcolor: "#bbdefb", height: "100%"}}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <AccessTimeIcon fontSize="large" color="primary" />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>Lịch làm việc hôm nay: {todaySchedules.length}</Typography>
                {/* Gọi hàm hiển thị chi tiết lịch trình */}
                {renderScheduleDetails()}
              </Box>
            </Box>
          </CardContent>
        </Card>   
          
        {/* Học sinh */}
        <Card sx={{ bgcolor: "#c8e6c9", height: "100%"}}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <SchoolIcon fontSize="large" color="success" />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>Học sinh cần đón</Typography>
                <Typography variant="body2">Tổng: {studentStats.total} học sinh</Typography>
                <Typography variant="body2">Đã đón/trả: {studentStats.pickedUp} học sinh</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>  

        {/* Xe buýt */}
        <Card sx={{ bgcolor: "#fff9c4", height: "100%"}}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <DirectionsBusIcon fontSize="large" color="warning" />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>Xe buýt phụ trách</Typography>
                <Typography variant="body2">Biển số: {busLicensePlate}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>  

        {/* Thông báo */}
        <Card sx={{ bgcolor: "#ffe0b2", height: "100%"}}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <NotificationsActiveIcon fontSize="large" color="error" />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>Thông báo</Typography>
                <Typography variant="body2">Thông báo mới: {notifications.length}</Typography>
                <Button 
                  size="small" 
                  sx={{ mt: 1, textTransform: "none"}} 
                  variant="outlined"
                  onClick={handleViewDetails}
                  >
                    Xem chi tiết</Button>
              </Box>
            </Box>
          </CardContent>
        </Card>  
      
      </Box>
      
      {/* Thông tin cá nhân bên phải */}
          <Card sx={{ 
              p: 2, 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              
          }} >
              <Avatar alt={driver.name} src="/driver-avatar.png" sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}/>
              <Box sx={{ width: '100%'}}> 
                  <Typography variant="h6" fontWeight={600} textAlign="center" mb={2}>{driver.name}</Typography>
                  {/* Hàng 1: Mã tài xế */}
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                      <Typography variant="body2" component="span" fontWeight={500} sx={{ mr: 2, minWidth: 100 }}>Mã tài xế:</Typography>
                      <Typography variant="body2" component="span">{driver.id}</Typography>
                  </Box>
                  {/* Hàng 2: Tên đăng nhập */}
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                      <Typography variant="body2" component="span" fontWeight={500} sx={{ mr: 2, minWidth: 100 }}>Tên đăng nhập</Typography>
                      <Typography variant="body2" component="span">{driver.username}</Typography>
                  </Box>
                  {/* Hàng 3: Số điện thoại */}
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                      <Typography variant="body2" component="span" fontWeight={500} sx={{ mr: 2, minWidth: 100 }}>Số điện thoại:</Typography>
                      <Typography variant="body2" component="span">{driver.phone || "Chưa cập nhật"}</Typography>
                  </Box>
                  {/* Hàng 4: Bằng lái */}
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                      <Typography variant="body2" component="span" fontWeight={500} sx={{ mr: 2, minWidth: 100 }}>Bằng lái:</Typography>
                      <Typography variant="body2" component="span">{driver.license || "Chưa cập nhật"}</Typography>
                  </Box>
                  {/* Hàng 5: Trạng thái (có màu sắc) */}
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                      <Typography variant="body2" component="span" fontWeight={500} sx={{ mr: 2, minWidth: 100 }}>Trạng thái:</Typography>
                      <Typography variant="body2" component="span" color={driver.status === 1 ? "success.main" : "error.main"}>{driver.status === 1 ? "Đang hoạt động" : "Nghỉ"}</Typography>
                  </Box>
              </Box>
          </Card>

      {/* DIALOG HIỂN THỊ THÔNG BÁO */}
      <Dialog
          open={isNotificationDialogOpen}
          onClose={() => setIsNotificationDialogOpen(false)}
          maxWidth="sm"
          fullWidth
      >
          <DialogTitle>Tất cả Thông báo (Tổng: {notifications.length})</DialogTitle>
          
          <DialogContent dividers>
              {isNotificationLoading ? (
                  <Typography>Đang tải thông báo...</Typography>
              ) : notifications.length === 0 ? (
                  <Typography color="text.secondary">Hiện không có thông báo nào.</Typography>
              ) : (
                  <Box
                    sx={{
                      maxHeight: '400px',
                      overflowY: 'auto',
                      pr: 1,
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f5f9',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#cbd5e1',
                        borderRadius: '4px',
                        '&:hover': {
                          background: '#94a3b8',
                        },
                      },
                    }}
                  >
                        {notifications.map((n) => (
                          // Sử dụng key để React có thể theo dõi các phần tử
                          <Box key={n.id} sx={{ mb: 2, p: 1 , borderBottom: '1px solid #eee'}}> 
                              <Typography variant="subtitle1" fontWeight={600} color="primary">
                                  {n.message || "Không có nội dung"} 
                              </Typography>
                              <Box sx={{ ml: 1, mt: 0.5 }}>
                                  <Typography variant="body2" color="text.secondary">
                                      Thời gian: {n.date || (n.ngayTao && n.gioTao ? `${n.ngayTao} ${n.gioTao}` : 'Chưa có thời gian')}
                                  </Typography>
                              </Box>
                          </Box>
                      ))}
                  </Box>
              )}
          </DialogContent>
          <DialogActions>
              <Button onClick={() => setIsNotificationDialogOpen(false)}>Đóng</Button>
          </DialogActions>
      </Dialog>
    </Box>
  );
}