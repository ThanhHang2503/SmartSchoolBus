"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, Typography, Box, CircularProgress, Alert, TextField, Button } from "@mui/material"
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
  type PieLabelRenderProps,
} from "recharts"

import DirectionsBusIcon from "@mui/icons-material/DirectionsBus"
import PersonIcon from "@mui/icons-material/Person"
import SchoolIcon from "@mui/icons-material/School"
import RouteIcon from "@mui/icons-material/Route"

import { getAllBuses, type IBus } from "@/api/busApi"
import { getAllDrivers } from "@/api/driverApi"
import { getAllStudents } from "@/api/studentApi"
import { getAllRoutes } from "@/api/routeApi"
import { getTripsMonthly } from "@/api/statsApi"

const COLORS = ["#2196f3", "#ef5350"]

export default function OverviewPage() {
  const [inputYear, setInputYear] = useState<string>(new Date().getFullYear().toString())
  const [displayYear, setDisplayYear] = useState<number>(new Date().getFullYear())
  const [stats, setStats] = useState({ buses: 0, drivers: 0, students: 0, routes: 0 })
  const [tripData, setTripData] = useState<{ name: string; trips: number }[]>([])
  const [busStatus, setBusStatus] = useState([
    { name: "Đang hoạt động", value: 0 },
    { name: "Bảo trì", value: 0 },
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async (year: number) => {
    try {
      setLoading(true)
      setError(null)

      const [buses, drivers, students, routes] = await Promise.all([
        getAllBuses(),
        getAllDrivers(),
        getAllStudents(),
        getAllRoutes(),
      ])

      setStats({
        buses: buses.length,
        drivers: drivers.length,
        students: students.length,
        routes: routes.length,
      })

      const active = buses.filter((b: IBus) => b.TinhTrang === 1).length
      setBusStatus([
        { name: "Đang hoạt động", value: active },
        { name: "Bảo trì", value: buses.length - active },
      ])

      const rawData = await getTripsMonthly(year)

      console.log("[v0] Received rawData in component:", rawData)

      const normalizedData = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1
        const found = rawData.find((item: any) => {
          const itemMonth = Number(item.month || item.Month || item.MONTH)
          return itemMonth === month
        })

        const foundAny = found as any
        return {
          name: `${month}`,
          trips: foundAny ? Number(foundAny.trips || foundAny.Trips || foundAny.TRIPS) || 0 : 0,
        }
      })

      console.log("[v0] Normalized data for chart:", normalizedData)

      setTripData(normalizedData)
    } catch (err) {
      setError("Không thể tải dữ liệu từ máy chủ!")
    } finally {
      setLoading(false)
    }
  }

  const handleStatClick = () => {
    const yearToFetch = inputYear ? Number(inputYear) : new Date().getFullYear()
    setDisplayYear(yearToFetch)
  }

  useEffect(() => {
    loadData(displayYear)
  }, [displayYear])

  const statItems: StatItem[] = [
    { label: "Xe buýt", value: stats.buses, icon: <DirectionsBusIcon />, bg: "#e3f2fd" },
    { label: "Tài xế", value: stats.drivers, icon: <PersonIcon />, bg: "#e3f2fd" },
    { label: "Học sinh", value: stats.students, icon: <SchoolIcon />, bg: "#e8f5e8" },
    { label: "Tuyến đường", value: stats.routes, icon: <RouteIcon />, bg: "#fff3e0" },
  ]

  const renderPieLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, outerRadius, name, value } = props
    if (cx == null || cy == null || midAngle == null || outerRadius == null) return null

    const RADIAN = Math.PI / 180
    const radius = Number(outerRadius) + 35
    const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN)
    const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="#222"
        textAnchor={x > Number(cx) ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: "15px", fontWeight: "bold" }}
      >
        {`${name}: ${value} xe`}
      </text>
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 6 }}>
      <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, sm: 3 } }}>
        {/* Tiêu đề trang */}
        <Typography variant="h4" fontWeight="bold" color="primary.dark" textAlign="center" mb={6}>
          Tổng quan hệ thống
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", gap: 3 }}>
            <CircularProgress size={50} thickness={4} />
            <Typography variant="h6" color="text.secondary">
              Đang tải dữ liệu năm {displayYear}...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            {/* 4 ô thống kê */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 8, justifyContent: "center" }}>
              {statItems.map((item, i) => (
                <Box key={i} sx={{ flex: { xs: "1 1 300px", md: "1 1 23%" }, maxWidth: { xs: "100%", md: "23%" } }}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      boxShadow: 6,
                      bgcolor: item.bg,
                      height: "100%",
                      transition: "all 0.3s",
                      "&:hover": { transform: "translateY(-10px)", boxShadow: 16 },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box>
                        <Typography variant="body1" color="text.secondary" fontWeight="medium">
                          {item.label}
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" color="primary.dark" sx={{ mt: 1 }}>
                          {item.value.toLocaleString("vi-VN")}
                        </Typography>
                      </Box>
                      <Box sx={{ fontSize: 60, opacity: 0.9, color: "primary.main" }}>{item.icon}</Box>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>

            {/* Hai biểu đồ – CHIỀU CAO NGẮN HƠN (320px) */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
              <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 48%" }, maxWidth: { xs: "100%", md: "48%" }, minWidth: 0 }}>
                <Card sx={{ p: 4, borderRadius: 3, boxShadow: 6 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="primary.dark">
                      Số chuyến xe theo tháng trong năm {displayYear}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <TextField
                        label="Nhập năm"
                        variant="outlined"
                        size="small"
                        value={inputYear}
                        onChange={(e) => setInputYear(e.target.value)}
                        placeholder={new Date().getFullYear().toString()}
                        sx={{ width: 120 }}
                        type="number"
                      />
                      <Button variant="contained" onClick={handleStatClick}>
                        Thống kê
                      </Button>
                    </Box>
                  </Box>

                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={tripData} barCategoryGap="15%" barSize={48}>
                      <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} interval={0} />
                      <YAxis tick={{ fontSize: 14 }} />
                      <Tooltip formatter={(value: number) => `${value} chuyến`} />
                      <Bar dataKey="trips" fill="#2196f3" radius={[12, 12, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Box>

              <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 48%" }, maxWidth: { xs: "100%", md: "48%" }, minWidth: 0 }}>
                <Card sx={{ p: 4, borderRadius: 3, boxShadow: 6 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.dark" textAlign="center">
                    Trạng thái xe buýt hiện tại
                  </Typography>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={busStatus}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={8}
                        label={renderPieLabel}
                      >
                        {busStatus.map((_, i) => (
                          <Cell key={i} fill={COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value} xe`} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

type StatItem = {
  label: string
  value: number
  icon: React.ReactNode
  bg: string
}
