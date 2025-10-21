import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, CssBaseline } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";

import Dashboard from "./Dashboard";
// import PhanCongPage from "./PhanCongPages";
// 🎯 File này mô phỏng giao diện tổng thể của trang Admin Dashboard cho hệ thống Bus Tracking
// Sử dụng React + TypeScript + Material UI
// Gồm 3 phần chính: Thanh tiêu đề (Header), Menu bên trái (Sidebar), và phần nội dung (Main Content)

// Các menu chính mà Admin có thể thao tác
const menuItems = [
  { text: "Tổng quan", icon: <DashboardIcon /> },
  { text: "Lịch trình", icon: <EventIcon /> },
  { text: "Phân công", icon: <PeopleIcon /> },
  { text: "Theo dõi", icon: <DirectionsBusIcon /> },
  { text: "Thông báo", icon: <NotificationsIcon /> },
];

// Hàm chính hiển thị toàn bộ giao diện Dashboard
export default function AdminDashboard() {
  // State để lưu lại menu đang được chọn
  const [selectedMenu, setSelectedMenu] = useState("Tổng quan");

  // Hàm xử lý khi người dùng click chọn 1 menu trong sidebar
  const handleMenuClick = (text: string) => {
    setSelectedMenu(text);
  };

  // Hàm hiển thị nội dung chính tương ứng với menu được chọn
  const renderContent = () => {
    switch (selectedMenu) {
      case "Tổng quan":
        return <Dashboard></Dashboard>;
      case "Lịch trình":
        return <Typography variant="h6">Đây là trang Lịch trình — quản lý thời gian xuất phát, điểm đón trả, và tuyến đường.</Typography>;
      case "Phân công":
                return <Typography variant="h6">Đây là trang Theo dõi — hiển thị bản đồ và vị trí xe bus theo thời gian thực.</Typography>;

        // return <PhanCongPage></PhanCongPage>;
      case "Theo dõi":
        return <Typography variant="h6">Đây là trang Theo dõi — hiển thị bản đồ và vị trí xe bus theo thời gian thực.</Typography>;
      case "Thông báo":
        return <Typography variant="h6">Đây là trang Thông báo — gửi thông tin, cảnh báo hoặc tin nhắn đến tài xế và phụ huynh.</Typography>;
      default:
        return <Typography variant="h6">Chọn một mục bên trái để xem nội dung tương ứng.</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Cấu hình cơ bản cho layout */}
      <CssBaseline />

      {/* Thanh tiêu đề phía trên cùng */}
      <AppBar position="fixed" sx={{ zIndex: 1201, backgroundColor: "#4A90E2" }}>
        <Toolbar>
          {/* Tên hệ thống */}
          <Typography variant="h6" noWrap component="div">
            🚌 Smart School Bus SSB 1.0
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Menu bên trái (Sidebar) */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#BFE6FF", // Màu xanh nhạt như trong mẫu bạn gửi
          },
        }}
      >
        <Toolbar /> {/* Đệm để tránh đè lên thanh AppBar */}
        <Box sx={{ overflow: "auto" }}>
          {/* Danh sách các chức năng */}
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={selectedMenu === item.text}
                  onClick={() => handleMenuClick(item.text)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}

            {/* Nút đăng xuất nằm cuối cùng */}
            <ListItem disablePadding>
              <ListItemButton onClick={() => alert("Đăng xuất hệ thống (demo)")}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Đăng xuất" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Phần nội dung chính */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#F9FAFB", p: 3 }}>
        {/* Đệm để tránh đè AppBar */}
        <Toolbar />

        {/* Nội dung động hiển thị theo menu được chọn */}
        {renderContent()}
      </Box>
    </Box>
  );
}

/* 🧩 Gợi ý tách file (sau này bạn có thể chia nhỏ ra cho gọn):

1️⃣ Sidebar.tsx — chứa phần Drawer và danh sách menu.
2️⃣ Header.tsx — chứa AppBar và Toolbar.
3️⃣ Content.tsx — xử lý render nội dung theo menu được chọn.
4️⃣ AdminDashboard.tsx — file chính import 3 file trên, quản lý state selectedMenu.

=> Cấu trúc này sẽ giúp code dễ bảo trì và mở rộng sau này.
*/
