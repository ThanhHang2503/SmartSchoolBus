// "use client";
// import MyMap from "@/components/Map";

// import {
//   Alert,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Grid,
//   MenuItem,
//   Paper,
//   Snackbar,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
// } from "@mui/material";
// import React, { useState } from "react";

// export default function MapAndStudentPage() {
//   // ✅ Dữ liệu mẫu học sinh
//   const studentsData = [
//     {
//       id: 1,
//       name: "Nguyễn Văn A",
//       grade: "Lớp 1A",
//       parent: "Nguyễn Văn B",
//       phone: "0901234567",
//       address: "123 Nguyễn Trãi",
//       status: "Chưa đón",
//     },
//     {
//       id: 2,
//       name: "Trần Thị B",
//       grade: "Lớp 2B",
//       parent: "Trần Văn C",
//       phone: "0909876543",
//       address: "456 Lê Lợi",
//       status: "Đã đón",
//     },
//     {
//       id: 3,
//       name: "Lê Văn C",
//       grade: "Lớp 3A",
//       parent: "Lê Thị D",
//       phone: "0912345678",
//       address: "789 Hai Bà Trưng",
//       status: "Đã trả",
//     },
//   ];

//   const [search, setSearch] = useState("");
//   const [selectedStudent, setSelectedStudent] = useState<any>(null);

//   // ✅ Lọc danh sách học sinh
//   const filteredStudents = studentsData.filter((s) =>
//     s.name.toLowerCase().includes(search.toLowerCase())
//   );

//   // ✅ State cảnh báo
//   const [alertType, setAlertType] = useState("");
//   const [message, setMessage] = useState("");
//   const [open, setOpen] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!alertType || !message.trim()) return;
//     setOpen(true);

//     // Sau này có thể gửi API ở đây
//     console.log({
//       alertType,
//       message,
//       timestamp: new Date().toISOString(),
//     });

//     setAlertType("");
//     setMessage("");
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" fontWeight={600} gutterBottom>
//         Xe buýt: R001 - Tuyến: A-B
//       </Typography>

//       {/* ✅ Khu vực bản đồ và cảnh báo (2 cột) */}
//       <Grid spacing={3} sx={{ mb: 4 }}>
//         {/* Cột trái: Bản đồ */}
//         <Grid size={{ xs: 12, md: 8 }}>
//           <Box
//             sx={{
//               height: 400,
//               borderRadius: 3,
//               overflow: "hidden",
//               border: "2px solid #9e9e9e",
//             }}
//           >
//             <Paper elevation={0} sx={{ height: "100%" }}>
//               <MyMap />
//             </Paper>
//           </Box>
//         </Grid>

//         {/* Cột phải: Gửi cảnh báo */}
//         <Grid size={{ xs: 12, md: 4 }}>
//           <Card sx={{ p: 2, height: "90%" }}>
//             <CardContent>
//               <Typography variant="subtitle1" fontWeight={600} gutterBottom>
//                 Gửi cảnh báo khẩn
//               </Typography>

//               <form onSubmit={handleSubmit}>
//                 <TextField
//                   select
//                   label="Loại cảnh báo"
//                   fullWidth
//                   value={alertType}
//                   onChange={(e) => setAlertType(e.target.value)}
//                   sx={{ mb: 2 }}
//                 >
//                   <MenuItem value="vehicle">
//                     🚐 Sự cố phương tiện (hư xe, kẹt xe...)
//                   </MenuItem>
//                   <MenuItem value="weather">🌧️ Ảnh hưởng thời tiết</MenuItem>
//                   <MenuItem value="student">
//                     👦 Sự cố học sinh (đi muộn, chưa ra điểm...)
//                   </MenuItem>
//                   <MenuItem value="delay">
//                     ⏰ Trễ giờ đón / trả học sinh
//                   </MenuItem>
//                   <MenuItem value="other">⚠️ Khác</MenuItem>
//                 </TextField>

//                 <TextField
//                   label="Nội dung chi tiết"
//                   multiline
//                   rows={4}
//                   fullWidth
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   sx={{ mb: 2 }}
//                   placeholder="Nhập chi tiết tình huống..."
//                 />

//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="error"
//                   fullWidth
//                   disabled={!alertType || !message.trim()}
//                 >
//                   🚨 Gửi cảnh báo ngay
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* ✅ Snackbar thông báo */}
//       <Snackbar
//         open={open}
//         autoHideDuration={3000}
//         onClose={() => setOpen(false)}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//       >
//         <Alert severity="success" onClose={() => setOpen(false)}>
//           ✅ Cảnh báo đã được gửi thành công!
//         </Alert>
//       </Snackbar>

//       {/* ✅ Ô tìm kiếm */}
//       <Box sx={{ mb: 2 }}>
//         <TextField
//           label="Tìm kiếm học sinh"
//           variant="outlined"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           fullWidth
//         />
//       </Box>

//       {/* ✅ Bảng danh sách học sinh */}
//       <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
//         <Table>
//           <TableHead>
//             <TableRow sx={{ bgcolor: "primary.main" }}>
//               <TableCell sx={{ color: "white", fontWeight: 600 }}>
//                 STT
//               </TableCell>
//               <TableCell sx={{ color: "white", fontWeight: 600 }}>
//                 Tên học sinh
//               </TableCell>
//               <TableCell sx={{ color: "white", fontWeight: 600 }}>
//                 Phụ huynh
//               </TableCell>
//               <TableCell sx={{ color: "white", fontWeight: 600 }}>
//                 Số điện thoại
//               </TableCell>
//               <TableCell sx={{ color: "white", fontWeight: 600 }}>
//                 Điểm đón/trả
//               </TableCell>
//               <TableCell sx={{ color: "white", fontWeight: 600 }}>
//                 Trạng thái
//               </TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {filteredStudents.map((student, index) => (
//               <TableRow
//                 key={student.id}
//                 hover
//                 sx={{ cursor: "pointer" }}
//                 onClick={() => setSelectedStudent(student)}
//               >
//                 <TableCell>{index + 1}</TableCell>
//                 <TableCell>{student.name}</TableCell>
//                 <TableCell>{student.parent}</TableCell>
//                 <TableCell>{student.phone}</TableCell>
//                 <TableCell>{student.address}</TableCell>
//                 <TableCell>
//                   <Chip
//                     label={student.status}
//                     color={
//                       student.status === "Đã trả"
//                         ? "success"
//                         : student.status === "Đã đón"
//                         ? "info"
//                         : "warning"
//                     }
//                     size="small"
//                   />
//                 </TableCell>
//               </TableRow>
//             ))}

//             {filteredStudents.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={6} align="center">
//                   Không tìm thấy học sinh
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* ✅ Hộp thoại chi tiết học sinh */}
//       <Dialog
//         open={Boolean(selectedStudent)}
//         onClose={() => setSelectedStudent(null)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Thông tin học sinh</DialogTitle>
//         <DialogContent dividers>
//           {selectedStudent && (
//             <Grid spacing={2}>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Typography>
//                   <strong>Họ tên:</strong> {selectedStudent.name}
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Typography>
//                   <strong>Lớp:</strong> {selectedStudent.grade}
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Typography>
//                   <strong>Phụ huynh:</strong> {selectedStudent.parent}
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Typography>
//                   <strong>SĐT:</strong> {selectedStudent.phone}
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 12 }}>
//                 <Typography>
//                   <strong>Địa chỉ:</strong> {selectedStudent.address}
//                 </Typography>
//               </Grid>
//               <Grid size={{ xs: 12 }}>
//                 <Typography>
//                   <strong>Trạng thái:</strong> {selectedStudent.status}
//                 </Typography>
//               </Grid>
//             </Grid>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setSelectedStudent(null)}>Đóng</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }