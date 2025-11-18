"use client";
import React, { useEffect, useState } from "react";
import { Grid, Card, Typography, Box } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import RouteIcon from "@mui/icons-material/Route";

// API
import { getAllBuses, IBus } from "@/api/busApi";
import { getAllDrivers, IDriver } from "@/api/driverApi";
import { getAllStudents, IStudentDetail } from "@/api/studentApi";
import { IRouteDetail, getAllRoutes } from "@/api/routeApi";
import { getTripsPerDay, ITripData } from "@/api/statsApi";

const COLORS = ["#2196f3", "#f44336"];
const DAYS_OF_WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ buses: 0, drivers: 0, students: 0, routes: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [tripData, setTripData] = useState<ITripData[]>([]);
  const [busStatus, setBusStatus] = useState<{ name: string; value: number }[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [buses, drivers, students, routes, trips] = await Promise.all([
          getAllBuses(),
          getAllDrivers(),
          getAllStudents(),
          getAllRoutes(),
          getTripsPerDay(),
        ]);

        setStats({
          buses: buses.length,
          drivers: drivers.length,
          students: students.length,
          routes: routes.length,
        });

        const normalizedTrips: ITripData[] = DAYS_OF_WEEK.map((day) => {
          const found = trips.find((t) => t.day === day);
          return { day, trips: found ? found.trips : 0 };
        });
        setTripData(normalizedTrips);

        const activeCount = buses.filter((b: IBus) => b.status === "active").length;
        const maintenanceCount = buses.filter((b: IBus) => b.status === "maintenance").length;
        setBusStatus([
          { name: "Đang hoạt động", value: activeCount },
          { name: "Bảo trì", value: maintenanceCount },
        ]);
      } catch (err) {
        console.error("Lỗi khi fetch Dashboard data:", err);
      } finally {
        setLoadingStats(false);
        setLoadingTrips(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      width: "100%", 
      backgroundColor: "#f5f5f5", 
      py: 6, // padding top/bottom
      display: "flex", 
      justifyContent: "center"
    }}>
      <Box sx={{ width: "100%", maxWidth: 1400, px: 3 }}>
        {/* Header */}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {[
            { label: "Xe buýt", value: stats.buses, icon: <DirectionsBusIcon fontSize="large" sx={{ color: "#2196f3" }} />, bgColor: "#e3f2fd" },
            { label: "Tài xế", value: stats.drivers, icon: <PersonIcon fontSize="large" sx={{ color: "#2196f3" }} />, bgColor: "#e3f2fd" },
            { label: "Học sinh", value: stats.students, icon: <SchoolIcon fontSize="large" sx={{ color: "#2196f3" }} />, bgColor: "#e3f2fd" },
            { label: "Tuyến đường", value: stats.routes, icon: <RouteIcon fontSize="large" sx={{ color: "#2196f3" }} />, bgColor: "#e3f2fd" },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 3,
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                backgroundColor: item.bgColor,
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.12)"
                }
              }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                  <Typography variant="h5" fontWeight="bold">{loadingStats ? "..." : item.value}</Typography>
                </Box>
                {item.icon}
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          {/* Bar Chart */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", backgroundColor: "#ffffff" }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Số chuyến xe trong tuần
              </Typography>
              {loadingTrips ? (
                <Typography>Đang tải dữ liệu...</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tripData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="day" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#ffffff", 
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px"
                      }} 
                    />
                    <Bar dataKey="trips" fill="#2196f3" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </Grid>

          {/* Pie Chart */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", backgroundColor: "#ffffff" }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Trạng thái xe buýt
              </Typography>
              {loadingTrips ? (
                <Typography>Đang tải dữ liệu...</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={busStatus}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {busStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#ffffff", 
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px"
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
