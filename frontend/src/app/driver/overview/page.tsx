"use client"
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

export default function DriverDashboard() {
  // hàm xem chi tiết thông báo
  const handleViewDetails = () => {
    alert("Bạn đã bấm Xem chi tiết!");
  };
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
                <Typography variant="subtitle1" fontWeight={600}>Lịch làm việc hôm nay</Typography>
                <Typography variant="body2">Ca sáng: 6:30 - 10:00</Typography>
                <Typography variant="body2">Ca chiều: 13:00 - 17:30</Typography>
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
                <Typography variant="body2">Tổng: 25 học sinh</Typography>
                <Typography variant="body2">Đã đón: 10 học sinh</Typography>
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
                <Typography variant="body2">Biển số: 51B-12345</Typography>
                <Typography variant="body2">Trạng thái: Đang di chuyển</Typography>
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
                <Typography variant="body2">Thông báo chưa đọc</Typography>
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
          alignItems: "center"
        }} >
            <Avatar alt="Driver Avatar" src="/driver-avatar.png" sx={{ width: 100, height: 100,  mx: "auto", mb: 2 }}/>
            <Box>
              <Typography variant="h6" fontWeight={600}>Nguyễn Văn Tài</Typography>
              <Typography variant="body2">Mã tài xế: TX001</Typography>
              <Typography variant="body2">Số điện thoại: 0905 123 456</Typography>
              <Typography variant="body2">Phụ trách tuyến: A - B</Typography>
              <Typography variant="body2" color="success.main">Trạng thái: Đang hoạt động</Typography>
            </Box>
          </Card>
       
        {/* Thống kê hôm nay */}
        <Card sx={{ bgcolor: "#90caf969", gridColumn: { sx: "span 1", md: "span 2"}, mt: 3}}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <QueryStatsIcon fontSize="large" color="action" />
              <Box>
                <Typography variant="h6" fontWeight={600}>Thống kê hôm nay</Typography>
                <Typography variant="body2">Số chuyến đã hoàn thành: 3</Typography>
                <Typography variant="body2">Số km đã đi: 42km</Typography>
                <Typography variant="body2">Thời gian làm việc: 5 giờ</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

    </Box>
  );
}