// src/pages/Dashboard.tsx
"use client";
import React from "react";
import Grid from "@mui/material/Grid";
import { Card, Typography, Box } from "@mui/material";
// import { GlobalStyles } from '@mui/material';

import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import RouteIcon from "@mui/icons-material/Route";

const Dashboard: React.FC = () => {
  // Giả lập dữ liệu thống kê
  const stats = [
    { label: "Xe buýt", value: 28, icon: <DirectionsBusIcon fontSize="large" color="primary" /> },
    { label: "Tài xế", value: 15, icon: <PersonIcon fontSize="large" color="primary" /> },
    { label: "Học sinh", value: 120, icon: <SchoolIcon fontSize="large" color="primary" /> },
    { label: "Tuyến đường", value: 8, icon: <RouteIcon fontSize="large" color="primary" /> },
  ];

  // Dữ liệu biểu đồ cột: số chuyến xe mỗi ngày
  const tripData = [
    { day: "T2", trips: 22 },
    { day: "T3", trips: 30 },
    { day: "T4", trips: 25 },
    { day: "T5", trips: 28 },
    { day: "T6", trips: 35 },
    { day: "T7", trips: 20 },
    { day: "CN", trips: 15 },
  ];

  // Dữ liệu biểu đồ tròn: trạng thái xe
  const busStatus = [
    { name: "Đang hoạt động", value: 22 },
    { name: "Bảo trì", value: 6 },
  ];

  const COLORS = ["#2196f3", "#f44336"];

  return (
    <Box sx={{ padding: 3 ,
      flexGrow: 1,
    width: "100%",
    height: "100%",
    p: 3,
    backgroundColor: "#f9fafc",
    }}>
      {/* Thẻ thống kê */}
      <Grid container spacing={3}>
        {stats.map((item, index) => (
          <Grid size={{xs:12, sm:6, md:3 }} >
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 2,
                boxShadow: 3,
                borderRadius: 3,
              }}
            >
              <Box>
                <Typography variant="h6" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {item.value}
                </Typography>
              </Box>
              {item.icon}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Biểu đồ */}
      <Grid container spacing={3} sx={{ marginTop: 3 }}>
        {/* Biểu đồ cột */}
        <Grid size={{xs:12, md:8}} >
          <Card sx={{ padding: 2, borderRadius: 3, boxShadow: 3, height:300, width:400 }}>
            <Typography variant="h6" gutterBottom>
              Số chuyến xe trong tuần
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={tripData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="trips" fill="#2196f3" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Biểu đồ tròn */}
        <Grid size={{xs:12, md:4}} >
          <Card sx={{ padding: 2, borderRadius: 3, boxShadow: 3, height:300 , width:400 }}>
            <Typography variant="h6" gutterBottom>
              Trạng thái xe buýt
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={busStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {busStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
