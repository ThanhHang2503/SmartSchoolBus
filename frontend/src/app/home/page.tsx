"use client";

import { Box, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600}>
        Trang chủ
      </Typography>
      <Typography>Chào mừng đến với trang chủ SmartSchoolBus!</Typography>
    </Box>
  );
}