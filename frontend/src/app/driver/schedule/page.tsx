"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  DateCalendar, PickersDay, LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useDriverSchedules } from '@/context/driverSchedulesContext';
import { IScheduleDriver, IStudentDetail, parseStudentList } from "@/api/driverApi"; 



// Dayjs setup
dayjs.extend(isSameOrBefore);

export default function SchedulePage() {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [expandedScheduleId, setExpandedScheduleId] = useState<number | null>(null);

  const { schedules, loading } = useDriverSchedules();
  const workingDaysSet = new Set(schedules.map(s => s.scheduleDate));

  const isWorkingDay = (date: Dayjs) => workingDaysSet.has(date.format("YYYY-MM-DD"));

  const selectedDaySchedules: IScheduleDriver[] = schedules.filter( s =>
    dayjs(s.scheduleDate).isSame(selectedDate, 'day')
  );

  //Component tùy chỉnh hiển thị mõi ngày
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

  // HÀM RENDER BẢNG HỌC SINH (NỘI TUYẾN)
  const renderStudentTableContent = (students: IStudentDetail[]) => {
      if (students.length === 0) {
          return (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                  Không có học sinh nào đăng ký cho chuyến này.
              </Typography>
          );
      }

      return (
          <TableContainer component={Paper} elevation={0} sx={{ border: 'none', borderTop: '1px solid #ddd' }}>
              <Table size="small" aria-label="student list table">
                  <TableHead sx={{ bgcolor: '#1976d2' }}>
                      <TableRow>
                          <TableCell sx={{ color: 'white' }}>STT</TableCell>
                          <TableCell sx={{ color: 'white' }}>Tên học sinh</TableCell>
                          <TableCell sx={{ color: 'white' }}>Lớp</TableCell>
                          <TableCell sx={{ color: 'white' }}>Phụ huynh</TableCell>
                          <TableCell sx={{ color: 'white' }}>Điểm đón</TableCell>
                          <TableCell sx={{ color: 'white' }}>Điểm trả</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {students.map((student, index) => (
                          <TableRow key={student.id}>
                              <TableCell component="th" scope="row">{index + 1}</TableCell>
                              <TableCell>
                                  <Typography variant="body2" fontWeight={500}>{student.name}</Typography>
                              </TableCell>
                              <TableCell>{student.class}</TableCell>
                              <TableCell>
                                  <Typography variant="body2">{student.parentName}</Typography>
                                  <Typography variant="caption" color="text.secondary">SĐT: {student.parentPhone}</Typography>
                              </TableCell>
                              <TableCell>{student.pickUpStopName}</TableCell>
                              <TableCell>{student.dropOffStopName}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>
      );
  };

  //HÀM HIỂN THỊ CHI TIẾT CHÍNH
  const renderScheduleDetails = () => {
    if (loading) {
      return <Typography variant="body2" color="text.secondary">Đang tải lịch trình...</Typography>;
    }
    if (selectedDaySchedules.length === 0) {
      return <Typography variant="body2" color="text.secondary">Ngày này bạn không có lịch làm việc</Typography>;
    }

    return selectedDaySchedules.map((schedule, index) => {
      // Phân tích cú pháp chuỗi ngay tại đây
      const students: IStudentDetail[] = parseStudentList(schedule.studentListRaw);
      const isExpanded = expandedScheduleId === schedule.id;

      return (
        <Accordion 
            key={schedule.id} 
            expanded={isExpanded}
            onChange={() => setExpandedScheduleId(isExpanded ? null : schedule.id)}
            sx={{ border: `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${schedule.id}-content`}
            id={`panel-${schedule.id}-header`}
            sx={{ bgcolor: isExpanded ? '#f5f5f5' : 'white' }}
          >
            <Box>
                <Typography variant="body1" fontWeight={600} color="primary">
                    Chuyến {index + 1}: {schedule.startTime} - {schedule.endTime || 'Kết thúc'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9em' }}>
                    Tuyến: {schedule.routeStart} → {schedule.routeEnd}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9em' }}>
                    Xe buýt: {schedule.busLicensePlate}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9em' }}>
                    Tổng số học sinh: {students.length}
                </Typography>
            </Box>
          </AccordionSummary>
          
          <AccordionDetails sx={{ p: 0 }}> 
            {/*GỌI HÀM RENDER BẢNG HỌC SINH NỘI TUYẾN */}
            {renderStudentTableContent(students)}
          </AccordionDetails>
        </Accordion>
      );
    });
  };


  return (
    <Box > 
      <Grid container spacing={2}>
        {/* Cột trái: Lịch */}
        <Grid size={{xs: 12, md: 4}}> 
          <Card sx={{ p: 1 }}>
            <CardContent>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={selectedDate}
                  onChange={(newValue) => {
                    if (newValue) {
                      setSelectedDate(newValue);
                      setExpandedScheduleId(null); 
                    }
                  }}
                  slots={{ day: CustomDay }}
                />
              </LocalizationProvider>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Lịch trình ngày: {selectedDaySchedules.length} chuyến
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
        <Grid size={{xs: 12, md: 8}}> 
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>Chi tiết lịch làm việc ngày {selectedDate.format("DD/MM/YYYY")}</Typography>
              
              <Box sx={{ mt: 2 }}>
                {/* HIỂN THỊ DANH SÁCH CHUYẾN ĐI DẠNG ACCORDION */}
                {renderScheduleDetails()}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}