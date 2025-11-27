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
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs, { type Dayjs } from "dayjs"
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
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)

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
    // If an element currently has focus (e.g., the Save button), blur it
    // before showing a dialog to avoid aria-hidden focus warnings.
    try {
      const active = document.activeElement as HTMLElement | null;
      if (active && typeof active.blur === 'function') active.blur();
    } catch (err) {
      // ignore (server-side rendering or non-browser)
    }
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
      const formattedDate = `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`
      setDateInput(formattedDate)
      // Cập nhật selectedDate cho DatePicker
      const dateObj = dayjs(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`)
      setSelectedDate(dateObj.isValid() ? dateObj : null)
    } else {
      setDateInput("")
      setSelectedDate(null)
    }
  }, [schedule.dayFormatted])

  // Xử lý khi chọn ngày từ DatePicker
  const handleDatePickerChange = (newValue: Dayjs | null) => {
    setSelectedDate(newValue)
    if (newValue && newValue.isValid()) {
      const y = newValue.year()
      const m = newValue.month() + 1
      const d = newValue.date()
      const formattedDate = `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`
      setDateInput(formattedDate)
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const selectedDateObj = new Date(y, m - 1, d)
      if (selectedDateObj < todayDate) {
        setDateError("Ngày phải lớn hơn hoặc bằng hôm nay!")
        handleChange("dayFormatted", "")
        return
      }
      setDateError("")
      handleChange("dayFormatted", `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`)
    } else {
      setDateInput("")
      handleChange("dayFormatted", "")
      setDateError("")
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="#1e293b" sx={{ fontSize: { xs: "1.8rem", sm: "2.2rem" } }}>
        Phân công lịch trình cho tài xế
      </Typography>

      {/* Chọn tài xế */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <TextField
          select
          fullWidth
          label="Chọn tài xế "
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(String(e.target.value ?? ""))}
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
              <Box component="span" sx={{ fontWeight: "bold", color: "#1976d2", mr: 1 }}>
                Mã: {driver.MaTX || driver.id}
              </Box>
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

          <Box sx={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
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
                    <DatePicker
                      value={selectedDate}
                      onChange={handleDatePickerChange}
                      format="DD/MM/YYYY"
                      minDate={dayjs(today)}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          placeholder: todayFormatted,
                          error: Boolean(dateError),
                          helperText: dateError || "dd/mm/yyyy hoặc click icon lịch",
                          inputProps: { maxLength: 10 },
                          sx: {
                            "& .MuiInputBase-root": {
                              height: 44,
                              display: "flex",
                              alignItems: "center",
                            },
                            "& .MuiOutlinedInput-input": {
                              py: 0,
                            },
                          },
                        },
                        openPickerIcon: {
                          sx: { color: "text.secondary", fontSize: 19 },
                        },
                      }}
                      slots={{
                        openPickerIcon: CalendarTodayIcon,
                      }}
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-root": {
                          height: 44,
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
    </LocalizationProvider>
  )
}

export default ScheduleAssignmentPage