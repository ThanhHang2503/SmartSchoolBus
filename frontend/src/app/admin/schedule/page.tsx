"use client"
import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"

import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import { getAllBuses, type IBus } from "@/api/busApi"
import { getAllDrivers, type IDriverDetail } from "@/api/driverApi"
import { getAllRoutes, type IRouteDetail } from "@/api/routeApi"
import { createSchedule, getSchedulesByDate, type ICreateSchedule, type ISchedule } from "@/api/scheduleApi"

type Trip = {
  dayFormatted: string
  MaXe: number | null
  MaTD: number | null
  startTime: string
  endTime: string
}

const ScheduleAssignmentPage = () => {
  const [busList, setBusList] = useState<IBus[]>([])
  const [driverList, setDriverList] = useState<IDriverDetail[]>([])
  const [routeList, setRouteList] = useState<IRouteDetail[]>([])
  const [selectedDriver, setSelectedDriver] = useState<string>("")
  const [driverSchedules, setDriverSchedules] = useState<Record<number, Trip>>({})
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogMessage, setDialogMessage] = useState("")
  const [dateInput, setDateInput] = useState("")
  const [dateError, setDateError] = useState("")

  useEffect(() => {
    Promise.all([getAllBuses(), getAllDrivers(), getAllRoutes()]).then(
      ([buses, drivers, routes]) => {
        setBusList(buses)
        setDriverList(drivers)
        setRouteList(routes)
      }
    )
  }, [])

  const currentDriverId = selectedDriver ? Number(selectedDriver) : null
  const today = new Date()
  const todayFormatted = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`

  const defaultTrip: Trip = {
    dayFormatted: "",
    MaXe: null,
    MaTD: null,
    startTime: "",
    endTime: "",
  }

  const schedule: Trip = selectedDriver
    ? driverSchedules[currentDriverId!] ?? defaultTrip
    : defaultTrip

  const handleChange = (field: keyof Trip, value: any) => {
    if (!currentDriverId) return
    setDriverSchedules((prev) => ({
      ...prev,
      [currentDriverId]: {
        ...schedule,
        [field]: value,
      },
    }))
  }

  const showDialog = (title: string, message: string) => {
    setDialogTitle(title)
    setDialogMessage(message)
    setOpenDialog(true)
  }

  const isValidDate = (d: number, m: number, y: number) => {
    const date = new Date(y, m - 1, d)
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d
  }

  const isOverlap = (newStart: string, newEnd: string, sch: ISchedule) => {
    const [hStart, mStart] = newStart.split(":").map(Number)
    const [hEnd, mEnd] = newEnd.split(":").map(Number)
    const newStartMinutes = hStart * 60 + mStart
    const newEndMinutes = hEnd * 60 + mEnd
    const [sh, sm] = sch.GioBatDau.split(":").map(Number)
    const [eh, em] = sch.GioKetThuc.split(":").map(Number)
    const schStart = sh * 60 + sm
    const schEnd = eh * 60 + em
    return newStartMinutes < schEnd && newEndMinutes > schStart
  }

  const handleSave = async () => {
    if (!currentDriverId)
      return showDialog("Cảnh báo", "Vui lòng chọn tài xế!")
    if (!schedule.dayFormatted || !schedule.MaXe || !schedule.MaTD || !schedule.startTime || !schedule.endTime)
      return showDialog("Cảnh báo", "Vui lòng nhập đầy đủ thông tin!")
    if (schedule.startTime >= schedule.endTime)
      return showDialog("Cảnh báo", "Giờ bắt đầu phải nhỏ hơn giờ kết thúc!")

    const [y, m, d] = schedule.dayFormatted.split("-").map(Number)
    const scheduleDate = new Date(y, m - 1, d)
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    if (scheduleDate < todayDate)
      return showDialog("Cảnh báo", "Ngày phải lớn hơn hoặc bằng hôm nay!")

    try {
      const schedulesInDay = await getSchedulesByDate(schedule.dayFormatted)
      const conflict = schedulesInDay.find(sch =>
        (sch.MaTX === currentDriverId || sch.MaXe === schedule.MaXe) &&
        isOverlap(schedule.startTime, schedule.endTime, sch)
      )
      if (conflict) {
        const driverName = driverList.find(d => d.id === conflict.MaTX)?.HoTen
        const busPlate = busList.find(b => b.id === conflict.MaXe)?.BienSo
        return showDialog("Cảnh báo", `Tài xế ${driverName} hoặc xe ${busPlate} đã có lịch trùng giờ trong ngày!`)
      }
    } catch (err) {
      console.error(err)
      return showDialog("Lỗi", "Không thể kiểm tra lịch trùng giờ!")
    }

    const payload: ICreateSchedule = {
      Ngay: schedule.dayFormatted,
      GioBatDau: schedule.startTime,
      GioKetThuc: schedule.endTime,
      MaTX: currentDriverId,
      MaXe: schedule.MaXe,
      MaTD: schedule.MaTD,
    }

    try {
      await createSchedule(payload)
      setDriverSchedules((prev) => ({
        ...prev,
        [currentDriverId]: { ...defaultTrip },
      }))
      setDateInput("")
      showDialog("Thành công", "Lịch trình đã được lưu thành công!")
    } catch (error: any) {
      showDialog("Lỗi", error.message || "Lưu thất bại! Vui lòng thử lại.")
    }
  }

  useEffect(() => {
    if (schedule.dayFormatted) {
      const [y, m, d] = schedule.dayFormatted.split("-")
      setDateInput(`${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`)
    } else {
      setDateInput("")
    }
  }, [schedule.dayFormatted])

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#1e293b" sx={{ fontSize: { xs: "1.8rem", sm: "2.2rem" } }}>
        Phân công lịch trình cho tài xế
      </Typography>

      {/* Chọn tài xế */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <TextField
          select
          fullWidth
          label="Chọn tài xế"
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
          SelectProps={{
            MenuProps: {
              PaperProps: { sx: { maxHeight: 300 } },
            },
          }}
          sx={{
            "& .MuiInputBase-root": { height: 56 },
            backgroundColor: "#f8f9ff",
          }}
        >
          <MenuItem value="">-- Chọn tài xế --</MenuItem>
          {driverList.map((driver) => (
            <MenuItem key={driver.id} value={driver.id}>
              <Box component="span" sx={{ fontWeight: "bold" }}>{driver.HoTen}</Box>
              <Box component="span" sx={{ ml: 1, color: "text.secondary", fontSize: "0.9rem" }}>
                - {driver.SoDienThoai}
              </Box>
            </MenuItem>
          ))}
        </TextField>
      </Paper>

      {/* Form nhập lịch trình */}
      {selectedDriver && (
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, boxShadow: 4, overflow: "hidden" }}>
          <Typography variant="h6" gutterBottom color="#1e293b" fontWeight="bold" mb={3}>
            Nhập thông tin lịch trình
          </Typography>

          <Box sx={{ overflowX: "auto", "-webkit-overflow-scrolling": "touch" }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                  <TableCell sx={{ width: { xs: 130, sm: 150 }, fontWeight: "bold" }}>Ngày</TableCell>
                  <TableCell sx={{ width: 130, fontWeight: "bold" }}>Số xe</TableCell>
                  <TableCell sx={{ width: 180, fontWeight: "bold" }}>Tuyến đường</TableCell>
                  <TableCell sx={{ width: 120, fontWeight: "bold" }}>Giờ bắt đầu</TableCell>
                  <TableCell sx={{ width: 120, fontWeight: "bold" }}>Giờ kết thúc</TableCell>
                  <TableCell align="center" sx={{ width: 110, fontWeight: "bold" }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {/* Ngày */}
                  <TableCell sx={{ p: { xs: 0.5, sm: 1 } }}>
                    <TextField
                      type="text"
                      placeholder={todayFormatted}
                      value={dateInput}
                      onChange={(e) => {
                        let v = e.target.value.replace(/[^\d]/g, "")
                        if (v.length > 8) v = v.slice(0, 8)
                        if (v.length >= 5) v = v.slice(0, 2) + "/" + v.slice(2, 4) + "/" + v.slice(4)
                        else if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2)
                        setDateInput(v)
                        if (v.length === 10) {
                          const d = Number(v.slice(0, 2))
                          const m = Number(v.slice(3, 5))
                          const y = Number(v.slice(6))
                          const parsed = new Date(y, m - 1, d)
                          const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                          if (!isValidDate(d, m, y) || parsed < todayDate) {
                            setDateError("Ngày không hợp lệ hoặc nhỏ hơn hôm nay!")
                            handleChange("dayFormatted", "")
                            return
                          }
                          setDateError("")
                          handleChange("dayFormatted", `${y}-${m.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`)
                        } else {
                          handleChange("dayFormatted", "")
                          setDateError("")
                        }
                      }}
                      error={Boolean(dateError)}
                      helperText={dateError || "dd/mm/yyyy"}
                      inputProps={{ maxLength: 10 }}
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <CalendarTodayIcon sx={{ color: "text.secondary", fontSize: 19, mr: 1, flexShrink: 0 }} />
                        ),
                      }}
                      // QUAN TRỌNG NHẤT: ép chiều cao cố định + căn giữa dọc
                      sx={{
                        "& .MuiInputBase-root": {
                          height: 44,
                          display: "flex",
                          alignItems: "center",
                        },
                        "& .MuiOutlinedInput-input": {
                          py: 0, // bỏ padding dọc thừa do adornment gây ra
                        },
                      }}
                    />
                  </TableCell>

                  {/* Xe */}
                  <TableCell sx={{ p: { xs: 0.5, sm: 1 } }}>
                    <TextField
                      select
                      value={schedule.MaXe ?? ""}
                      onChange={(e) => handleChange("MaXe", e.target.value === "" ? null : Number(e.target.value))}
                      size="small"
                      fullWidth
                      SelectProps={{
                        MenuProps: { PaperProps: { sx: { width: 220 } } },
                      }}
                      sx={{ "& .MuiInputBase-root": { height: 44 } }}
                    >
                      <MenuItem value="">-- Chọn xe --</MenuItem>
                      {busList.map((bus) => (
                        <MenuItem key={bus.id} value={bus.id} disabled={bus.TinhTrang !== 1}>
                          {bus.BienSo} {bus.TinhTrang === 1 ? "" : "(Bảo trì)"}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>

                  {/* Tuyến đường */}
                  <TableCell sx={{ p: { xs: 0.5, sm: 1 } }}>
                    <TextField
                      select
                      value={schedule.MaTD ?? ""}
                      onChange={(e) => handleChange("MaTD", e.target.value === "" ? null : Number(e.target.value))}
                      size="small"
                      fullWidth
                      SelectProps={{
                        MenuProps: { PaperProps: { sx: { width: 260 } } },
                      }}
                      sx={{ "& .MuiInputBase-root": { height: 44 } }}
                    >
                      <MenuItem value="">-- Chọn tuyến --</MenuItem>
                      {routeList.map((route) => (
                        <MenuItem key={route.id} value={route.id}>
                          {route.NoiBatDau} → {route.NoiKetThuc}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>

                  {/* Giờ bắt đầu */}
                  <TableCell sx={{ p: { xs: 0.5, sm: 1 } }}>
                    <TextField
                      type="time"
                      value={schedule.startTime}
                      onChange={(e) => handleChange("startTime", e.target.value)}
                      size="small"
                      fullWidth
                      sx={{ "& .MuiInputBase-root": { height: 44 } }}
                    />
                  </TableCell>

                  {/* Giờ kết thúc */}
                  <TableCell sx={{ p: { xs: 0.5, sm: 1 } }}>
                    <TextField
                      type="time"
                      value={schedule.endTime}
                      onChange={(e) => handleChange("endTime", e.target.value)}
                      size="small"
                      fullWidth
                      sx={{ "& .MuiInputBase-root": { height: 44 } }}
                    />
                  </TableCell>

                  {/* Nút Lưu */}
                  <TableCell align="center" sx={{ p: { xs: 0.5, sm: 1 } }}>
                    <Button
                      variant="contained"
                      size="medium"
                      onClick={handleSave}
                      sx={{
                        background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                        color: "white",
                        fontWeight: "bold",
                        minWidth: 90,
                        height: 44,
                        borderRadius: 2,
                        boxShadow: "0 4px 12px rgba(25,118,210,0.4)",
                        "&:hover": { background: "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)" },
                      }}
                    >
                      Lưu
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Paper>
      )}

      {/* Dialog thông báo */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: 20, color: "#1976d2", textAlign: "center" }}>
          {dialogTitle}
        </DialogTitle>
        <DialogContent sx={{ fontSize: 17, textAlign: "center", py: 3 }}>
          {dialogMessage}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button onClick={() => setOpenDialog(false)} variant="contained" size="large">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ScheduleAssignmentPage