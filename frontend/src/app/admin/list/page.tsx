"use client";
import React from "react";
import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Paper,
  MenuItem,
  TextField,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Chip,
  Avatar,
  Button,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import PersonIcon from "@mui/icons-material/Person"
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus"
import SchoolIcon from "@mui/icons-material/School"
import AddIcon from "@mui/icons-material/Add"
import { getAllDrivers } from "@/api/driverApi";
import { getAllParents } from "@/api/parentApi";
import { getAllStudents } from "@/api/studentApi";
import { useTranslation } from "react-i18next";

// Kiểu dữ liệu chung cho UI
type ViewType = "driver" | "parent" | "student";

export default function DanhSachPage() {
  const { t } = useTranslation('common');
  const [view, setView] = useState<ViewType | "">("");
  const [loading, setLoading] = useState(false) // Đổi thành false vì ban đầu chưa cần load
  const [dataList, setDataList] = useState<any[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>("")
  const [filteredDataList, setFilteredDataList] = useState<any[]>([])

  useEffect(() => {
    if (!view) {
      setDataList([]) // Xóa dữ liệu cũ khi chuyển loại
      return
    }

    const loadData = async () => {
      setLoading(true)
      try {
        if (view === "driver") {
          const drivers = await getAllDrivers()
          setDataList(drivers)
          setFilteredDataList(drivers)
        } else if (view === "parent") {
          const parents = await getAllParents()
          setDataList(parents)
          setFilteredDataList(parents)
        } else if (view === "student") {
          const students = await getAllStudents()
          setDataList(students)
          setFilteredDataList(students)
        }
      } catch (err) {
        console.error("Lỗi load dữ liệu:", err)
      }
      setLoading(false)
    }
    loadData()
  }, [view])

  const getIcon = (sx?: any) => {
    switch (view) {
      case "driver":
        return <DirectionsBusIcon sx={sx || { color: "#0f766e", fontSize: "2rem" }} />
      case "parent":
        return <PersonIcon sx={sx || { color: "#1e40af", fontSize: "2rem" }} />
      case "student":
        return <SchoolIcon sx={sx || { color: "#be123c", fontSize: "2rem" }} />
      default:
        return <SchoolIcon sx={sx || { color: "#be123c", fontSize: "2rem" }} />
    }
  }

  const getStatusColor = (status: boolean) => {
    return status ? "success" : "default"
  }

  const getStatusLabel = (status: boolean) => {
    return status ? t('common.active') : t('common.inactive')
  }

  // Hàm lọc dữ liệu dựa trên từ khóa tìm kiếm (chỉ lọc theo tên)
  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      // Nếu từ khóa rỗng, hiển thị tất cả
      setFilteredDataList(dataList)
      return
    }

    const keyword = searchKeyword.trim().toLowerCase()
    const filtered = dataList.filter((item) => {
      if (view === "driver") {
        // Chỉ lọc theo tên tài xế
        return item.name?.toLowerCase().includes(keyword)
      } else if (view === "parent") {
        // Chỉ lọc theo tên phụ huynh
        return item.HoTen?.toLowerCase().includes(keyword)
      } else if (view === "student") {
        // Chỉ lọc theo tên học sinh
        return item.name?.toLowerCase().includes(keyword)
      }
      return false
    })
    setFilteredDataList(filtered)
  }

  // Reset filter khi view thay đổi
  useEffect(() => {
    setSearchKeyword("")
    setFilteredDataList(dataList)
  }, [view, dataList])

  return (
    <Box
      sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1600, mx: "auto", minHeight: "100vh", backgroundColor: "#f5f7fa" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          mb: 5,
          pb: 3,
          borderBottom: "3px solid #e2e8f0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #0f766e 0%, #1e40af 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {view ? getIcon({ color: "white", fontSize: "2rem" }) : 
              <SchoolIcon sx={{ color: "white", fontSize: "2rem" }} />
            }
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#1e293b",
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                letterSpacing: "-0.5px",
              }}
            >
              {t('admin.viewList')}
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.95rem", mt: 0.5 }}>{t('admin.infoManagement')}</Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2.5,
          mb: 4,
          alignItems: "center",
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        <TextField
          select
          label={t('common.classification')}
          value={view}
          onChange={(e) => {
            setView(e.target.value as ViewType)
          }}
          sx={{
            minWidth: { xs: "100%", sm: "200px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              backgroundColor: "white",
              transition: "all 0.3s ease",
              border: "1.5px solid #e2e8f0",
              "&:hover": {
                borderColor: "#cbd5e1",
                backgroundColor: "#f8fafc",
              },
              "&.Mui-focused": {
                borderColor: "#0f766e",
                backgroundColor: "white",
                boxShadow: "0 0 0 3px rgba(15, 118, 110, 0.1)",
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        >
          <MenuItem value="driver">🚌 {t('admin.driver')}</MenuItem>
          <MenuItem value="parent">👨‍👩‍👧 {t('admin.parent')}</MenuItem>
          <MenuItem value="student">🎓 {t('admin.student')}</MenuItem>
        </TextField>
        
        {/* Search Box */}
        <Box
          sx={{
            p: 2,
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            width: { xs: "100%", sm: "280px", md: "320px" },
            backgroundColor: "white",
            "&:hover": {
              borderColor: "#cbd5e1",
            },
            "&:focus-within": {
              borderColor: "#0f766e",
              boxShadow: "0 0 0 3px rgba(15, 118, 110, 0.1)",
            },
          }}
        >
          <TextField
            type="text"
            placeholder={t('common.searchPlaceholder')}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
            fullWidth
            variant="standard"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8", fontSize: "1.2rem" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-input": {
                fontSize: "0.95rem",
                color: "#1e293b",
                "&::placeholder": {
                  color: "#94a3b8",
                  opacity: 1,
                },
              },
            }}
          />
        </Box>
        
        {/* Search Button */}
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            minWidth: { xs: "100%", sm: "120px" },
            height: "56px",
            borderRadius: "8px",
            backgroundColor: "#0f766e",
            color: "white",
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.95rem",
            "&:hover": {
              backgroundColor: "#0d9488",
            },
          }}
        >
          {t('common.search')}
        </Button>
      </Box>

      {/* Màn hình khi chưa chọn gì */}
      {!view && !loading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            textAlign: "center",
            color: "#64748b",
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <SearchIcon sx={{ fontSize: 60, color: "#94a3b8" }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: "#1e293b" }}>
            Chọn một phân loại để xem danh sách
          </Typography>
        </Box>
      )}

      {/* Khi đã chọn và đang loading */}
      {view && loading && (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: "400px" }}>
          <CircularProgress sx={{ color: "#0f766e" }} />
        </Box>
      )}

      {/* Khi đã chọn và có dữ liệu */}
      {view && !loading && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "14px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            maxHeight: "600px",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f5f9",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#cbd5e1",
              borderRadius: "4px",
              "&:hover": {
                background: "#94a3b8",
              },
            },
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                {view === "driver" && (
                  <>
                    <TableCell sx={{ fontWeight: 700, color: "#0f766e", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.8px", py: 2.5 }}>
                      Tên Tài Xế
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#0f766e", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.8px", py: 2.5 }}>
                      Số Điện Thoại
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#0f766e", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.8px", py: 2.5 }}>
                      Tên Đăng Nhập
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#0f766e", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.8px", py: 2.5 }}>
                      Trạng Thái
                    </TableCell>
                  </>
                )}
                {view === "parent" && (
                  <>
                    <TableCell sx={{ fontWeight: 700, color: "#1e40af", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.8px", py: 2.5 }}>
                      Tên Phụ Huynh
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e40af", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.8px", py: 2.5 }}>
                      Số Điện Thoại
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#1e40af", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.8px", py: 2.5 }}>
                      Tên Đăng Nhập
                    </TableCell>
                  </>
                )}
                {view === "student" && (
                  <>
                    <TableCell sx={{ fontWeight: 700, color: "#be123c", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.8px", py: 2.5 }}>
                      Tên Học Sinh
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#be123c", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.8px", py: 2.5 }}>
                      Lớp
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#be123c", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.8px", py: 2.5 }}>
                      Phụ Huynh
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#be123c", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.8px", py: 2.5 }}>
                      Trạm Đón/Trả
                    </TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDataList.length > 0 ? (
                filteredDataList.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                        transition: "background-color 0.2s ease",
                      },
                      borderBottom: "1px solid #f1f5f9",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {/* Nội dung bảng giữ nguyên như cũ */}
                    {view === "driver" && (
                      <>
                        <TableCell sx={{ py: 2.5, color: "#1e293b" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                            <Avatar
                              sx={{
                                width: 44,
                                height: 44,
                                backgroundColor: "#0f766e",
                                fontSize: "1.1rem",
                                fontWeight: 700,
                                color: "white",
                              }}
                            >
                              {item.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "#1e293b" }}>
                                {item.name}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 2.5, color: "#64748b", fontSize: "0.9rem" }}>{item.SoDienThoai}</TableCell>
                        <TableCell sx={{ py: 2.5, color: "#64748b", fontSize: "0.9rem" }}>{item.TenDangNhap}</TableCell>
                        <TableCell sx={{ py: 2.5 }}>
                          <Chip
                            label={getStatusLabel(item.TrangThai)}
                            color={getStatusColor(item.TrangThai)}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              borderRadius: "6px",
                            }}
                          />
                        </TableCell>
                      </>
                    )}
                    {view === "parent" && (
                      <>
                        <TableCell sx={{ py: 2.5, color: "#1e293b" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                            <Avatar
                              sx={{
                                width: 44,
                                height: 44,
                                backgroundColor: "#1e40af",
                                fontSize: "1.1rem",
                                fontWeight: 700,
                                color: "white",
                              }}
                            >
                              {item.HoTen?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "#1e293b" }}>
                                {item.HoTen}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 2.5, color: "#64748b", fontSize: "0.9rem" }}>{item.SoDienThoai}</TableCell>
                        <TableCell sx={{ py: 2.5, color: "#64748b", fontSize: "0.9rem" }}>{item.TenDangNhap}</TableCell>
                      </>
                    )}
                    {view === "student" && (
                      <>
                        <TableCell sx={{ py: 2.5, color: "#1e293b" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                            <Avatar
                              sx={{
                                width: 44,
                                height: 44,
                                backgroundColor: "#be123c",
                                fontSize: "1.1rem",
                                fontWeight: 700,
                                color: "white",
                              }}
                            >
                              {item.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "#1e293b" }}>
                                {item.name}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 2.5, color: "#64748b" }}>
                          <Chip
                            label={item.Lop}
                            variant="outlined"
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              borderRadius: "6px",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 2.5, color: "#64748b", fontSize: "0.9rem" }}>{item.TenPhuHuynh}</TableCell>
                        <TableCell sx={{ py: 2.5, color: "#64748b" }}>
                          <Box sx={{ fontSize: "0.875rem" }}>
                            <Typography sx={{ color: "#64748b", mb: 0.5, fontSize: "0.85rem" }}>
                              Đón: {item.TenTramDon}
                            </Typography>
                            <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                              Trả: {item.TenTramTra}
                            </Typography>
                          </Box>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={view === "student" ? 4 : view === "driver" ? 4 : 3} align="center" sx={{ py: 6, color: "#94a3b8" }}>
                    <Typography variant="h6" sx={{ color: "#64748b" }}>
                      {searchKeyword.trim() ? t('common.noResultsFound') : t('common.noData')}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}