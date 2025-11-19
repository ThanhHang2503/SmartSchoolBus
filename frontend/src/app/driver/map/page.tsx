"use client";

import MyMap from "@/components/Map";

import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Select,
  FormControl,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

export default function MapAndStudentPage() {
  // DỮ LIỆU GIẢ LẬP
  const [studentsData, setStudentsData] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      grade: "Lớp 1A",
      parent: "Nguyễn Văn B",
      phone: "0901234567",
      address: "123 Nguyễn Trãi",
      status: "Chưa đón",
    },
    {
      id: 2,
      name: "Trần Thị B",
      grade: "Lớp 2B",
      parent: "Trần Văn C",
      phone: "0909876543",
      address: "456 Lê Lợi",
      status: "Đã đón",
    },
    {
      id: 3,
      name: "Lê Văn C",
      grade: "Lớp 3A",
      parent: "Lê Thị D",
      phone: "0912345678",
      address: "789 Hai Bà Trưng",
      status: "Đã trả",
    },
  ]);

  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // Lọc học sinh
  const filteredStudents = studentsData.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );


  // Gửi cảnh báo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertType || !message.trim()) return;

    setSnackbarMessage("Cảnh báo đã được gửi thành công!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);

    console.log("Gửi cảnh báo:", { alertType, message, timestamp: new Date() });

    setAlertType("");
    setMessage("");
  };

  // CẬP NHẬT TRẠNG THÁI TRỰC TIẾP TRONG BẢNG
  const handleStatusChange = (id: number, newStatus: string) => {
    setStudentsData((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );

    setSnackbarMessage(`Cập nhật trạng thái: ${newStatus}`);
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Xe buýt: R001 - Tuyến: A-B
      </Typography>

      {/* BẢN ĐỒ + GỬI CẢNH BÁO */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{
              height: 400,
              borderRadius: 3,
              overflow: "hidden",
              border: "2px solid #9e9e9e",
            }}
          >
            <Paper elevation={0} sx={{ height: "100%" }}>
              <MyMap />
            </Paper>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2, height: "90%" }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Gửi cảnh báo khẩn
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  select
                  label="Loại cảnh báo"
                  fullWidth
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value)}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="vehicle">Sự cố phương tiện</MenuItem>
                  <MenuItem value="weather">Ảnh hưởng thời tiết</MenuItem>
                  <MenuItem value="student">Sự cố học sinh</MenuItem>
                  <MenuItem value="delay">Trễ giờ</MenuItem>
                  <MenuItem value="other">Khác</MenuItem>
                </TextField>

                <TextField
                  label="Nội dung chi tiết"
                  multiline
                  rows={4}
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="Nhập chi tiết..."
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  fullWidth
                  disabled={!alertType || !message.trim()}
                >
                  Gửi cảnh báo ngay
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* TÌM KIẾM */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Tìm kiếm học sinh"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
      </Box>

      {/* BẢNG HỌC SINH - CHỈ CÒN CỘT "TRẠNG THÁI" */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>STT</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Tên học sinh</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Phụ huynh</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>SĐT</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Điểm đón/trả</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Trạng thái</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredStudents.map((student, index) => (
              <TableRow
                key={student.id}
                hover
                onClick={() => setSelectedStudent(student)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.parent}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>{student.address}</TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 130 }}>
                    <Select
                      value={student.status}
                      onChange={(e) => {
                        e.stopPropagation(); // Ngăn mở dialog khi chọn
                        handleStatusChange(student.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        fontSize: "0.875rem",
                        "& .MuiSelect-select": {
                          padding: "6px 8px",
                        },
                      }}
                    >
                      <MenuItem value="Chưa đón">Chưa đón</MenuItem>
                      <MenuItem value="Đã đón">Đã đón</MenuItem>
                      <MenuItem value="Đã trả">Đã trả</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}

            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không tìm thấy học sinh
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DIALOG CHI TIẾT (CHỈ XEM) */}
      <Dialog
        open={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thông tin học sinh</DialogTitle>
        <DialogContent dividers>
          {selectedStudent && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography><strong>Họ tên:</strong> {selectedStudent.name}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography><strong>Lớp:</strong> {selectedStudent.grade}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography><strong>Phụ huynh:</strong> {selectedStudent.parent}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography><strong>SĐT:</strong> {selectedStudent.phone}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography><strong>Địa chỉ:</strong> {selectedStudent.address}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography><strong>Trạng thái:</strong> {selectedStudent.status}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedStudent(null)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* THÔNG BÁO */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setOpenSnackbar(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}