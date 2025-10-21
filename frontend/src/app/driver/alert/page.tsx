"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";

export default function AlertPage() {
  const [alertType, setAlertType] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertType || !message.trim()) return;
    setOpen(true);

    // Sau này có thể gọi API gửi cảnh báo ở đây
    console.log({
      alertType,
      message,
      timestamp: new Date().toISOString(),
    });

    setAlertType("");
    setMessage("");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Gửi cảnh báo khẩn
      </Typography>

      <Grid container spacing={3}>
        {/* Khung bên trái: Gửi cảnh báo */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Gửi cảnh báo đến hệ thống
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
                  <MenuItem value="vehicle">🚐 Sự cố phương tiện (hư xe, kẹt xe...)</MenuItem>
                  <MenuItem value="weather">🌧️ Ảnh hưởng thời tiết</MenuItem>
                  <MenuItem value="student">👦 Sự cố học sinh (đi muộn, chưa ra điểm...)</MenuItem>
                  <MenuItem value="delay">⏰ Trễ giờ đón / trả học sinh</MenuItem>
                  <MenuItem value="other">⚠️ Khác</MenuItem>
                </TextField>

                <TextField
                  label="Nội dung chi tiết"
                  multiline
                  rows={4}
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="Nhập chi tiết tình huống..."
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  fullWidth
                  disabled={!alertType || !message.trim()}
                >
                  🚨 Gửi cảnh báo ngay
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Khung bên phải: Gợi ý nhanh */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2, bgcolor: "#f9f9f9" }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Các loại cảnh báo thường gặp
              </Typography>

              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                <li>🚐 Xe bị hỏng hoặc kẹt xe giữa đường</li>
                <li>🌧️ Trời mưa lớn, ảnh hưởng thời gian đón học sinh</li>
                <li>👦 Học sinh chưa ra điểm đón hoặc đi muộn</li>
                <li>⏰ Dự kiến trễ giờ trả học sinh</li>
                <li>📱 Vấn đề khẩn khác cần thông báo cho phụ huynh & admin</li>
              </ul>

              <Typography variant="body2" sx={{ mt: 2, color: "gray" }}>
                ⚠️ Cảnh báo sẽ được gửi đến hệ thống quản lý và phụ huynh liên quan.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Thông báo gửi thành công */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" onClose={() => setOpen(false)}>
          ✅ Cảnh báo đã được gửi thành công!
        </Alert>
      </Snackbar>
    </Box>
  );
}
