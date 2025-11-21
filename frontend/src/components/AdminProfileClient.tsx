// components/AdminProfileClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Loader2, User, Phone } from "lucide-react";
import { IAdminDetail, getAdminById } from "@/api/adminApi";
import { IAccount, getAccountById } from "@/api/accountApi";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2d4f7f" },
    secondary: { main: "#1976d2" },
  },
});

export default function AdminProfileClient() {
  const [admin, setAdmin] = useState<IAdminDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (!token || !userData) throw new Error("Chưa đăng nhập");

      const user = JSON.parse(userData); // chứa user.id = id tài khoản
      const account = await getAccountById(user.id, token); // lấy thông tin account
      console.log("Account:", account);
      const admin = await getAdminById(account.MaTK, token); // lấy admin dựa vào MaTK từ account

      setAdmin({ ...admin, TenDangNhap: account.TenDangNhap }); // merge dữ liệu
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải dữ liệu admin");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  if (loading)
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          minHeight="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="#f3f4f6"
        >
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </Box>
      </ThemeProvider>
    );

  if (error || !admin)
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          minHeight="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="#f3f4f6"
        >
          <Typography color="error" fontWeight={600}>
            {error || "Không tìm thấy thông tin admin"}
          </Typography>
        </Box>
      </ThemeProvider>
    );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box minHeight="100vh" display="flex" justifyContent="center" pt={10} bgcolor="#f3f4f6" p={2}>
        <Box maxWidth="600px" width="100%" bgcolor="white" borderRadius={3} boxShadow={3} p={4}>
          <Box display="flex" gap={3} mb={4} alignItems="center">
            <Box width={96} height={96} borderRadius="50%" bgcolor="#2d4f7f" display="flex" justifyContent="center" alignItems="center">
              <User style={{ width: 48, height: 48, color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={700}>{admin.HoTen}</Typography>
              <Typography color="textSecondary">ID: {admin.id}</Typography>
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" gap={4}>
            <Box display="flex" gap={2} alignItems="center">
              <Phone color="#1976d2" />
              <Box>
                <Typography color="textSecondary">Số điện thoại</Typography>
                <Typography fontWeight={600}>{admin.SoDienThoai}</Typography>
              </Box>
            </Box>

            <Box display="flex" gap={2} alignItems="center">
              <Box width={20} height={20} borderRadius="50%" bgcolor={admin.TrangThai === 1 ? "green" : "red"} />
              <Box>
                <Typography color="textSecondary">Trạng thái</Typography>
                <Typography fontWeight={600}>{admin.TrangThai === 1 ? "Hoạt động" : "Không hoạt động"}</Typography>
              </Box>
            </Box>

            <Box display="flex" gap={2} alignItems="center">
              <User color="#1976d2" />
              <Box>
                <Typography color="textSecondary">Tên đăng nhập</Typography>
                <Typography fontWeight={600}>{admin.TenDangNhap}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
