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
      paper: "#ffffff", // Màu nền cho các thành phần
    },
    text: {
      primary: "#2d4f7f",
      secondary: "#9dc4d8",
    },
    action: {
      disabledBackground: "#b8d4e8",
      disabled: "#7eb3d4",
    },
  },
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
    h1: {
      fontWeight: 700,
      fontSize: "2rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    button: {
      textTransform: "none", // Giữ nguyên chữ thường
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      color: "#2d4f7f",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 20px",
          "&:hover": {
            backgroundColor: "#6a9fc0",
          },
          "&.Mui-disabled": {
            backgroundColor: "#b8d4e8",
            color: "#7eb3d4",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#b8d4e8",
            },
            "&:hover fieldset": {
              borderColor: "#9dc4d8",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#7eb3d4",
            },
          },
          "& .MuiInputBase-input": {
            color: "#2d4f7f",
          },
        },
      },
    },
  },
})

export default theme