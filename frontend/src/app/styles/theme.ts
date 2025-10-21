"use client"

import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    primary: {
      main: "#2d4f7f", // Màu chủ đạo (xanh đậm)
    },
    secondary: {
      main: "#7eb3d4", // Màu phụ
    },
    background: {
      default: "#f0f8ff", // Màu nền chính
    },
  },
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
    h1: {
      fontWeight: 700,
      fontSize: "2rem",
    },
    button: {
      textTransform: "none", // Giữ nguyên chữ thường
      fontWeight: 600,
    },
  },
})

export default theme
