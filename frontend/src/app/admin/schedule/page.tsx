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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import { getAllBuses, type IBus } from "@/api/busApi"
import { getAllDrivers, type IDriverDetail } from "@/api/driverApi"
import { getAllRoutes, type IRouteDetail } from "@/api/routeApi"
import { createSchedule, type ICreateSchedule } from "@/api/scheduleApi"

type Trip = {
  dayFormatted?: string
  MaXe: number | null
  MaTD: number | null
  startTime: string
  endTime: string
}

const ScheduleAssignmentPage = () => {
  const [busList, setBusList] = useState<IBus[]>([])
  const [driverList, setDriverList] = useState<IDriverDetail[]>([])
  const [routeList, setRouteList] = useState<IRouteDetail[]>([])
  const [selectedDriver, setSelectedDriver] = useState<number | "">("")
  const [driverSchedules, setDriverSchedules] = useState<Record<number, Trip>>({})
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogMessage, setDialogMessage] = useState("")

  useEffect(() => {
    getAllBuses().then(setBusList)
    getAllDrivers().then(setDriverList)
    getAllRoutes().then(setRouteList)
  }, [])

  const schedule =
    selectedDriver && driverSchedules[selectedDriver]
      ? driverSchedules[selectedDriver]
      : {
          dayFormatted: new Date().toISOString().split("T")[0],
          MaXe: null,
          MaTD: null,
          startTime: "",
          endTime: "",
        }

  const handleChange = (field: keyof Trip, value: any) => {
    if (selectedDriver === "") return
    setDriverSchedules((prev) => ({
      ...prev,
      [selectedDriver]: {
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

  const handleSave = async () => {
    if (!selectedDriver) return showDialog("Cảnh báo", "Vui lòng chọn tài xế trước khi lưu.")
    if (!schedule.MaXe || !schedule.MaTD || !schedule.startTime || !schedule.endTime) {
      return showDialog("Cảnh báo", "Vui lòng nhập đầy đủ thông tin lịch trình.")
    }

    const payload: ICreateSchedule = {
      Ngay: schedule.dayFormatted!,
      GioBatDau: schedule.startTime,
      GioKetThuc: schedule.endTime,
      MaTX: Number(selectedDriver),
      MaXe: schedule.MaXe,
      MaTD: schedule.MaTD,
    }

    try {
      const result = await createSchedule(payload)
      // Cập nhật state local
      setDriverSchedules((prev) => ({
        ...prev,
        [selectedDriver]: { ...schedule },
      }))
      showDialog("Thành công", "✅ Lịch trình đã lưu!")
    } catch (error: any) {
      if (error.message.includes("409")) {
        showDialog("Cảnh báo", "⚠️ Lịch trình này đã tồn tại hoặc trùng giờ.")
      } else {
        showDialog("Lỗi", "❌ Lưu thất bại!")
      }
    }
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        🚌 Phân công lịch trình cho tài xế
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          select
          fullWidth
          label="Chọn tài xế để xếp lịch"
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(Number(e.target.value))}
        >
          <MenuItem value="">-- Chọn tài xế --</MenuItem>
          {driverList.map((driver) => (
            <MenuItem key={driver.id} value={driver.id}>
              {driver.name} ({driver.SoDienThoai})
            </MenuItem>
          ))}
        </TextField>
      </Paper>

      {selectedDriver !== "" && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Lịch trình làm việc
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ngày</TableCell>
                <TableCell>Số xe</TableCell>
                <TableCell>Tuyến đường</TableCell>
                <TableCell>Giờ bắt đầu</TableCell>
                <TableCell>Giờ kết thúc</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <TextField
                    type="date"
                    fullWidth
                    value={schedule.dayFormatted}
                    onChange={(e) => handleChange("dayFormatted", e.target.value)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    fullWidth
                    value={schedule.MaXe ?? ""}
                    onChange={(e) => handleChange("MaXe", Number(e.target.value))}
                  >
                    <MenuItem value="">-- Chọn xe --</MenuItem>
                    {busList.map((bus) => (
                      <MenuItem key={bus.id} value={bus.id}>
                        {bus.BienSo} ({bus.TinhTrang === 1 ? "Hoạt động" : "Bảo trì"})
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    fullWidth
                    value={schedule.MaTD ?? ""}
                    onChange={(e) => handleChange("MaTD", Number(e.target.value))}
                  >
                    <MenuItem value="">-- Chọn tuyến --</MenuItem>
                    {routeList.map((route) => (
                      <MenuItem key={route.id} value={route.id}>
                        {route.NoiBatDau} → {route.NoiKetThuc}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) => handleChange("startTime", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) => handleChange("endTime", e.target.value)}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Divider sx={{ my: 2 }} />

          <Button variant="contained" onClick={handleSave}>
            💾 Lưu lịch trình
          </Button>
        </Paper>
      )}

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 4,
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
              minWidth: "380px",
            },
          }}
        >
          {/* Dialog Title */}
          <DialogTitle
            sx={{
              fontWeight: "bold",
              fontSize: "16px",
              color: "#1976d2",
              padding: "16px 24px",
            }}
          >
            {dialogTitle}
          </DialogTitle>

          {/* Dialog Content */}
          <DialogContent
            sx={{
              fontSize: "17px",
              color: "#333333",
              display: "flex",
              justifyContent: "center",
              padding: "0px 24px 16px 24px",
            }}
          >
            {dialogMessage}
          </DialogContent>

          {/* Dialog Actions */}
          <DialogActions sx={{ padding: "8px 24px 16px 24px" }}>
            <Button
              onClick={() => setOpenDialog(false)}
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 4,
                textTransform: "none",
                padding: "6px 20px",
                fontWeight: "bold",
              }}
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  )
}

export default ScheduleAssignmentPage
