"use client"
import React from "react"
import { Box, Typography, Paper } from "@mui/material"
import MyMap from "@/components/Map"

export default function AdminMapPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Bản đồ tuyến và vị trí
      </Typography>

      <Paper sx={{ height: 520, borderRadius: 3, overflow: "hidden", p: 0 }} elevation={1}>
        <MyMap />
      </Paper>
    </Box>
  )
}
