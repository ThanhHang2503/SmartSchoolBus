"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";

// ✅ Dữ liệu mẫu
const studentsData = [
  { id: 1, name: "Nguyễn Văn A", grade: "Lớp 1A", parent: "Nguyễn Văn B", phone: "0901234567", address: "123 Nguyễn Trãi" },
  { id: 2, name: "Trần Thị B", grade: "Lớp 2B", parent: "Trần Văn C", phone: "0909876543", address: "456 Lê Lợi" },
  { id: 3, name: "Lê Văn C", grade: "Lớp 3A", parent: "Lê Thị D", phone: "0912345678", address: "789 Hai Bà Trưng" },
];

export default function StudentListPage() {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const filteredStudents = studentsData.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Danh sách học sinh
      </Typography>

      {/* Ô tìm kiếm */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Tìm kiếm học sinh"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
      </Box>

      {/* Bảng danh sách */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>STT</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Tên học sinh</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Lớp</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Phụ huynh</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Số điện thoại</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student, index) => (
              <TableRow
                key={student.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => setSelectedStudent(student)}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell>{student.parent}</TableCell>
                <TableCell>{student.phone}</TableCell>
              </TableRow>
            ))}
            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không tìm thấy học sinh
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Hộp thoại xem chi tiết */}
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
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedStudent(null)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
