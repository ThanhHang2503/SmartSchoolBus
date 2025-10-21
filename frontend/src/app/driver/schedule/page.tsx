"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import {
  DateCalendar,
  PickersDay,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

// Giả lập danh sách ngày có lịch làm việc
const workingDays = [
  dayjs().startOf("month").add(1, "day"),
  dayjs().startOf("month").add(3, "day"),
  dayjs().startOf("month").add(5, "day"),
  dayjs().startOf("month").add(10, "day"),
  dayjs().startOf("month").add(15, "day"),
  dayjs().startOf("month").add(22, "day"),
];

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState("day");
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const handleChangeView = (event: React.SyntheticEvent, newView: string | null) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  // ✅ Hàm kiểm tra xem ngày có trong danh sách làm việc không
  const isWorkingDay = (date: Dayjs) =>
    workingDays.some((d) => d.isSame(date, "day"));

  // ✅ Component tùy chỉnh hiển thị mỗi ngày
  const CustomDay = (props: any) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const isWorkDay = isWorkingDay(day);

    return (
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        sx={{
          bgcolor: isWorkDay ? "#bbdefb" : "transparent", // nền xanh nhạt nếu có lịch
          borderRadius: "50%",
          border: isWorkDay ? "1px solid #1976d2" : "none",
          "&:hover": {
            bgcolor: isWorkDay ? "#90caf9" : "rgba(0,0,0,0.08)",
          },
        }}
      />
    );
  };

  return (
    // sx={{ p: 3 }}
    <Box > 
      {/* Tiêu đề */}
      {/* <Typography variant="h5" fontWeight={600} gutterBottom>
        Lịch làm việc
      </Typography> */}

      {/* Bộ chọn chế độ xem */}
      <ToggleButtonGroup
        color="primary"
        value={viewMode}
        exclusive
        onChange={handleChangeView}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="day">Ngày</ToggleButton>
        <ToggleButton value="week">Tuần</ToggleButton>
        <ToggleButton value="month">Tháng</ToggleButton>
      </ToggleButtonGroup>

      <Grid container spacing={2}>
        {/* Cột trái: Lịch */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 1 }}>
            <CardContent>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={selectedDate}
                  onChange={(newValue) => newValue && setSelectedDate(newValue)}
                  slots={{ day: CustomDay }}
                />
              </LocalizationProvider>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Ngày được chọn:
              </Typography>
              <Typography variant="body2">
                {selectedDate.format("DD/MM/YYYY")}
              </Typography>

              {/* Ghi chú */}
              <Box sx={{ mt: 2 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 14, height: 14, bgcolor: "#bbdefb", border: "1px solid #1976d2", borderRadius: "50%" }} />
                  <Typography variant="body2">Có lịch làm việc</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Cột phải: Chi tiết lịch */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Lịch làm việc -{" "}
                {viewMode === "day"
                  ? "Trong ngày"
                  : viewMode === "week"
                  ? "Trong tuần"
                  : "Trong tháng"}
              </Typography>

              {/* Nội dung theo chế độ */}
              {viewMode === "day" && (
                <>
                  {isWorkingDay(selectedDate) ? (
                    <>
                      <Typography variant="body1">Ca sáng: 6:30 - 10:00</Typography>
                      <Typography variant="body1">Ca chiều: 13:00 - 17:30</Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Hôm nay bạn không có lịch làm việc 🎉
                    </Typography>
                  )}
                </>
              )}

              {viewMode === "week" && (
                <Box>
                  {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"].map((d, i) => (
                    <Typography key={i} sx={{ mb: 1 }}>
                      {d}: 7:00 - 17:00
                    </Typography>
                  ))}
                </Box>
              )}

              {viewMode === "month" && (
                <Typography variant="body2">
                  Lịch tháng hiển thị theo dạng tổng hợp. Bạn có{" "}
                  <strong>{workingDays.length}</strong> ngày làm việc trong tháng này.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
