"use client"

import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Select,
  CircularProgress,
  Chip,
  Container,
  LinearProgress,
  Fade,
} from "@mui/material"
import { useEffect, useState } from "react"
import SendIcon from "@mui/icons-material/Send"
import HistoryIcon from "@mui/icons-material/History"
import PeopleIcon from "@mui/icons-material/People"

import { getAllParents } from "@/api/parentApi"
import { getAllDrivers } from "@/api/driverApi"
import { getAllAdmins } from "@/api/adminApi"
import { getNoticesByUser, getAllNotices, sendNotice, type INotice } from "@/api/noticeApi"
import { createAndSendNotification, getAllNotifications, getNotificationsByAccount, type INotification } from "@/api/notificationApi"

type UserType = "driver" | "parent" | "admin"
type NoticeType = "all" | "all-driver" | "all-parent" | "single"

type ChatUser = {
  id: string
  rawId: string
  name: string
  type: UserType
  extraId?: number
}

const AdminNotifyPage = () => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([])
  const [noticeType, setNoticeType] = useState<NoticeType>("all")
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [content, setContent] = useState("")
  const [loaiTB, setLoaiTB] = useState<string>("Khác") // Loại thông báo
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [currentAdminMaTK, setCurrentAdminMaTK] = useState<number | null>(null)

  const [generalHistory, setGeneralHistory] = useState<INotice[]>([])
  const [singleHistory, setSingleHistory] = useState<INotice[]>([])
  const [notificationHistory, setNotificationHistory] = useState<INotification[]>([])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  // Load danh sách người dùng (chỉ lấy Active = 1)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Lấy MaTK của admin hiện tại từ token
        const token = localStorage.getItem('token')
        if (token) {
          try {
            // Decode JWT token để lấy thông tin user
            const payload = JSON.parse(atob(token.split('.')[1]))
            if (payload.userId || payload.id || payload.MaTK) {
              const maTK = Number(payload.userId || payload.id || payload.MaTK)
              setCurrentAdminMaTK(maTK)
              console.log("Admin MaTK từ token:", maTK)
            }
          } catch (e) {
            console.error("Lỗi decode token:", e)
            // Fallback: thử lấy từ localStorage user
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
              try {
                const user = JSON.parse(storedUser)
                if (user.id || user.MaTK) {
                  setCurrentAdminMaTK(Number(user.id || user.MaTK))
                }
              } catch (e2) {
                console.error("Lỗi parse user từ localStorage:", e2)
              }
            }
          }
        }

        const [parentsRes, driversRes, adminsRes] = await Promise.all([
          getAllParents(),
          getAllDrivers(),
          getAllAdmins(),
        ])

        const activeParents = (parentsRes || []).filter((p: any) => (p.Active ?? 1) === 1)
        const activeDrivers = (driversRes || []).filter((d: any) => (d.Active ?? 1) === 1)
        const activeAdmins = (adminsRes || []).filter((a: any) => a.TrangThai === 1)

        const parentList: ChatUser[] = activeParents
          .filter((p: any) => p.MaTK) // Chỉ lấy những người có MaTK
          .map((p: any) => ({
            id: `parent-${p.MaPH || p.id}`,
            rawId: String(p.MaTK),
            name: p.HoTen || p.name || "Không có tên",
            type: "parent" as const,
            extraId: p.MaPH || p.id,
          }))

        const driverList: ChatUser[] = activeDrivers
          .filter((d: any) => d.MaTK) // Chỉ lấy những người có MaTK
          .map((d: any) => ({
            id: `driver-${d.MaTX || d.id}`,
            rawId: String(d.MaTK),
            name: d.HoTen || d.name || "Không có tên",
            type: "driver" as const,
            extraId: d.MaTX || d.id,
          }))

        // Không thêm admin vào danh sách vì admin chỉ có thể gửi cho tài xế và phụ huynh
        setChatUsers([...driverList, ...parentList])
      } catch (err) {
        console.error("Lỗi tải danh sách người dùng:", err)
        setError("Không thể tải danh sách người dùng. Vui lòng thử lại.")
      }
    }

    fetchUsers()
  }, [])

  // Load lịch sử tổng quát khi vào trang
  useEffect(() => {
    const fetchGeneralHistory = async () => {
      try {
        // Load từ cả 2 API: notice và notifications
        const [notices, notifications] = await Promise.all([
          getAllNotices().catch(() => []),
          getAllNotifications().catch(() => []),
        ])
        setGeneralHistory(notices)
        setNotificationHistory(notifications)
      } catch (err) {
        console.error("Lỗi lấy lịch sử tổng quát:", err)
      }
    }

    fetchGeneralHistory()
  }, [])

  // Load lịch sử khi chọn user
  useEffect(() => {
    if (!selectedUser) {
      setSingleHistory([])
      return
    }

    const fetchHistory = async () => {
      try {
        const notices = await getNoticesByUser(Number(selectedUser.rawId))
        setSingleHistory(notices)
      } catch (err) {
        console.error("Lỗi lấy lịch sử:", err)
      }
    }

    fetchHistory()
  }, [selectedUser])

  const handleSendNotice = async () => {
    if (!content.trim()) {
      setError("Vui lòng nhập nội dung thông báo!")
      return
    }

    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      let result
      
      // Xử lý theo loại thông báo
    switch (noticeType) {
        case "all":
          // Gửi cho tất cả tài xế và phụ huynh (không gửi cho admin)
          const allReceivers = chatUsers.map((u) => Number(u.rawId))
          // Gửi qua API notice (sẽ tự động lọc admin)
          result = await sendNotice(content.trim(), allReceivers, currentAdminMaTK || undefined)
          break
          
        case "all-driver":
          // Gửi cho tất cả tài xế - dùng Role = 3
          result = await createAndSendNotification(content.trim(), undefined, 3, currentAdminMaTK || undefined, loaiTB)
          break
          
        case "all-parent":
          // Gửi cho tất cả phụ huynh - dùng Role = 1
          result = await createAndSendNotification(content.trim(), undefined, 1, currentAdminMaTK || undefined, loaiTB)
          break
          
        case "single":
          if (!selectedUser) {
            setError("Vui lòng chọn người nhận!")
            setLoading(false)
            return
          }
          // Kiểm tra không được gửi cho chính mình
          if (currentAdminMaTK && Number(selectedUser.rawId) === currentAdminMaTK) {
            setError("Bạn không thể gửi thông báo cho chính mình!")
            setLoading(false)
            return
          }
          // Gửi cho 1 người - dùng API notice (sẽ tự động lọc admin)
          result = await sendNotice(content.trim(), [Number(selectedUser.rawId)], currentAdminMaTK || undefined)
          break
          
        default:
          throw new Error("Loại thông báo không hợp lệ")
      }

      console.log('createAndSendNotification response:', result)

      // Refresh lịch sử từ server
      try {
        const [notices, notifications] = await Promise.all([
          getAllNotices().catch(() => []),
          getAllNotifications().catch(() => []),
        ])
        setGeneralHistory(notices)
        setNotificationHistory(notifications)
      } catch (err) {
        console.error("Lỗi refresh lịch sử:", err)
      }

      // Nếu đang xem lịch sử của user cụ thể, refresh luôn
      if (selectedUser) {
        try {
          const userNotices = await getNoticesByUser(Number(selectedUser.rawId))
          setSingleHistory(userNotices)
        } catch (err) {
          console.error("Lỗi refresh lịch sử user:", err)
        }
      }

      setContent("")
      setSelectedUser(null)
      setSuccess(true)
    } catch (err: any) {
      console.error("Lỗi gửi:", err)
      setError(err.message || "Gửi thất bại. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  // Kết hợp lịch sử từ cả notice và notifications
  const combinedHistory = selectedUser 
    ? singleHistory 
    : [...generalHistory, ...notificationHistory.map(n => ({
        MaTB: n.MaTB,
        NoiDung: n.NoiDung,
        NgayTao: typeof n.NgayTao === 'string' ? n.NgayTao : n.NgayTao?.toString() || '',
        GioTao: typeof n.GioTao === 'string' ? n.GioTao : n.GioTao?.toString() || '',
        ThoiGian: (n.NgayTao && n.GioTao) 
          ? `${typeof n.NgayTao === 'string' ? n.NgayTao : n.NgayTao.toString()} ${typeof n.GioTao === 'string' ? n.GioTao : n.GioTao.toString()}`
          : '',
      } as INotice))]
  
  // Loại bỏ trùng lặp theo MaTB và sắp xếp theo thời gian
  const uniqueHistory = combinedHistory
    .filter((notice, index, self) => 
      index === self.findIndex(n => n.MaTB === notice.MaTB)
    )
    .sort((a, b) => {
      const timeA = a.ThoiGian ? new Date(a.ThoiGian).getTime() : 0
      const timeB = b.ThoiGian ? new Date(b.ThoiGian).getTime() : 0
      return timeB - timeA
    })
  
  const historyToShow = uniqueHistory
  const driverCount = chatUsers.filter((u) => u.type === "driver").length
  const parentCount = chatUsers.filter((u) => u.type === "parent").length

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
        backgroundColor: "#f8fafc",
      }}
    >
      <Container maxWidth="xl">
        {/* Main Grid - Adjusted layout for larger panels */}
        <Grid
          container
          spacing={4}
        >
          {/* Form Panel - Increased to md={6} for more width */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper
              sx={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                p: 4,
                borderRadius: 3,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4, flex: 1 }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    background: "#dbeafe",
                    border: "1px solid #93c5fd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SendIcon sx={{ color: "#3b82f6", fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    Tạo thông báo
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Soạn nội dung và gửi ngay
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3, borderColor: "#e2e8f0" }} />

              {/* Notice Type Select - Increased font sizes */}
              <Box sx={{ mb: 4, flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#475569",
                    letterSpacing: "0.05em",
                    mb: 1.5,
                  }}
                >
                  Loại thông báo
                </Typography>
                <Select
                  fullWidth
                  value={noticeType}
                  onChange={(e) => {
                    setNoticeType(e.target.value as NoticeType)
                    setSelectedUser(null)
                    setError("")
                  }}
                  sx={{
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    color: "#1e293b",
                    borderRadius: 2,
                    height: 52,
                    fontSize: 16,
                    "&:hover": {
                      background: "#e2e8f0",
                      border: "1px solid #94a3b8",
                    },
                    "&.Mui-focused": {
                      background: "#ffffff",
                      border: "1px solid #3b82f6",
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "transparent",
                    },
                  }}
                >
                  <MenuItem value="all">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PeopleIcon sx={{ fontSize: 18 }} />
                      Tất cả tài xế và phụ huynh
                    </Box>
                  </MenuItem>
                  <MenuItem value="all-driver">Tất cả tài xế ({driverCount})</MenuItem>
                  <MenuItem value="all-parent">Tất cả phụ huynh ({parentCount})</MenuItem>
                  <MenuItem value="single">Gửi cá nhân</MenuItem>
                </Select>
              </Box>

              {/* User Select - Conditional - Increased font sizes */}
              {noticeType === "single" && (
                <Fade in={noticeType === "single"}>
                  <Box sx={{ mb: 4, flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        textTransform: "uppercase",
                        fontWeight: 700,
                        color: "#475569",
                        letterSpacing: "0.05em",
                        mb: 1.5,
                      }}
                    >
                      Chọn người nhận
                    </Typography>
                    <Select
                      fullWidth
                      displayEmpty
                      value={selectedUser?.id || ""}
                      onChange={(e) => {
                        const user = chatUsers.find((u) => u.id === e.target.value)
                        setSelectedUser(user || null)
                      }}
                      sx={{
                        background: "#f1f5f9",
                        border: "1px solid #cbd5e1",
                        color: "#1e293b",
                        borderRadius: 2,
                        height: 52,
                        fontSize: 16,
                        "&:hover": {
                          background: "#e2e8f0",
                          border: "1px solid #94a3b8",
                        },
                        "&.Mui-focused": {
                          background: "#ffffff",
                          border: "1px solid #3b82f6",
                          boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "transparent",
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Chọn người nhận...
                      </MenuItem>
                      {chatUsers.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Chip
                              label={user.type === "driver" ? "TX" : user.type === "parent" ? "PH" : "AD"}
                              size="small"
                              sx={{
                                background:
                                  user.type === "driver" ? "#dbeafe" : user.type === "parent" ? "#e9d5ff" : "#fef9c3",
                                color: user.type === "driver" ? "#1e40af" : user.type === "parent" ? "#6b21a8" : "#92400e",
                                fontWeight: 600,
                                fontSize: 11,
                                border:
                                  user.type === "driver"
                                    ? "1px solid #93c5fd"
                                    : user.type === "parent"
                                    ? "1px solid #d8b4fe"
                                    : "1px solid #fcd34d",
                              }}
                            />
                            <span>{user.name}</span>
                            {user.extraId && (
                              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                                (#{user.extraId})
                              </Typography>
                            )}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </Fade>
              )}

              {/* Loại thông báo */}
              <Box sx={{ mb: 4, flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: "#475569",
                    letterSpacing: "0.05em",
                    mb: 1.5,
                  }}
                >
                  Loại thông báo
                </Typography>
                <Select
                  fullWidth
                  value={loaiTB}
                  onChange={(e) => setLoaiTB(e.target.value)}
                  sx={{
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    color: "#1e293b",
                    borderRadius: 2,
                    height: 52,
                    fontSize: 16,
                    "&:hover": {
                      background: "#e2e8f0",
                      border: "1px solid #94a3b8",
                    },
                    "&.Mui-focused": {
                      background: "#ffffff",
                      border: "1px solid #3b82f6",
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "transparent",
                    },
                  }}
                >
                  <MenuItem value="Xe trễ">Xe trễ</MenuItem>
                  <MenuItem value="Sự cố">Sự cố</MenuItem>
                  <MenuItem value="Khác">Khác</MenuItem>
                </Select>
              </Box>

              {/* Content Textarea - Increased rows and padding */}
              <Box sx={{ mb: 4, flex: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: "#475569",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Nội dung
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 500 }}>
                    {content.length}/500
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={9}
                  placeholder="Nhập nội dung thông báo..."
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, 500))}
                  sx={{
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      color: "#1e293b",
                      fontFamily: "inherit",
                      fontSize: 15,
                      "&:hover": {
                        background: "#e2e8f0",
                        border: "1px solid #94a3b8",
                      },
                      "&.Mui-focused": {
                        background: "#ffffff",
                        border: "1px solid #3b82f6",
                        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                      },
                      "& fieldset": {
                        borderColor: "transparent",
                      },
                    },
                    "& .MuiOutlinedInput-input::placeholder": {
                      color: "#94a3b8",
                      opacity: 1,
                    },
                  }}
                />
                {/* Character Counter Progress */}
                <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(content.length / 500) * 100}
                    sx={{
                      flex: 1,
                      height: 8,
                      borderRadius: 3,
                      background: "#e2e8f0",
                      "& .MuiLinearProgress-bar": {
                        background: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 500, minWidth: 35 }}>
                    {Math.round((content.length / 500) * 100)}%
                  </Typography>
                </Box>
              </Box>

              {/* Send Button - Increased height */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSendNotice}
                disabled={loading || !content.trim() || (noticeType === "single" && !selectedUser)}
                sx={{
                  height: 56,
                  background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: 16,
                  textTransform: "none",
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
                  "&:hover:not(:disabled)": {
                    boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.5)",
                  },
                  "&:disabled": {
                    background: "#cbd5e1",
                    color: "#94a3b8",
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: "inherit" }} />
                    Đang gửi...
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SendIcon />
                    Gửi thông báo
                  </Box>
                )}
              </Button>
            </Paper>
          </Grid>

          {/* History Panel - Increased to md={6} for consistent width */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper
              sx={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 3,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                maxHeight: "calc(100vh - 64px)", // Giới hạn chiều cao tối đa
              }}
            >
              {/* Header - Increased padding */}
              <Box
                sx={{
                  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  borderBottom: "1px solid #e2e8f0",
                  p: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexShrink: 0, // Không co lại khi cuộn
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2,
                      background: "#dbeafe",
                      border: "1px solid #93c5fd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <HistoryIcon sx={{ color: "#3b82f6", fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
                      Lịch sử thông báo
                    </Typography>
                    {selectedUser && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                        <Chip
                          label={
                            selectedUser.type === "driver"
                              ? "Tài xế"
                              : selectedUser.type === "parent"
                              ? "Phụ huynh"
                              : "Quản trị"
                          }
                          size="small"
                          sx={{
                            background:
                              selectedUser.type === "driver" ? "#dbeafe" : selectedUser.type === "parent" ? "#e9d5ff" : "#fef9c3",
                            color: selectedUser.type === "driver" ? "#1e40af" : selectedUser.type === "parent" ? "#6b21a8" : "#92400e",
                            fontWeight: 600,
                          }}
                        />
                        <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500 }}>
                          {selectedUser.name}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ borderColor: "#e2e8f0", flexShrink: 0 }} />

              {/* History List - Fixed height with scroll */}
              <List 
                sx={{ 
                  flex: 1, 
                  overflowY: "auto", 
                  p: 0,
                  height: "100%",
                  maxHeight: "600px", // Chiều cao cố định
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
                {historyToShow.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 8,
                      color: "#94a3b8",
                    }}
                  >
                    <HistoryIcon sx={{ fontSize: 56, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                      Chưa có thông báo nào
                    </Typography>
                    <Typography variant="body2">Thông báo sẽ xuất hiện ở đây</Typography>
                  </Box>
                ) : (
                  historyToShow.map((notice, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        borderBottom: "1px solid #e2e8f0",
                        py: 3,
                        px: 4,
                        "&:last-child": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <Box
                          sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}
                        >
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                              {selectedUser ? selectedUser.name : "Thông báo hệ thống"}
                              {!selectedUser && (notice as any).SoNguoiNhan && (
                                <Typography component="span" variant="body2" sx={{ color: "#64748b", ml: 1 }}>
                                  ({(notice as any).SoNguoiNhan} người nhận)
                                </Typography>
                              )}
                            </Typography>
                            {(notice as any).LoaiTB && (
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  display: "inline-block",
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  backgroundColor: 
                                    (notice as any).LoaiTB === "Xe trễ" ? "#fef3c7" :
                                    (notice as any).LoaiTB === "Sự cố" ? "#fee2e2" :
                                    "#e0e7ff",
                                  color: 
                                    (notice as any).LoaiTB === "Xe trễ" ? "#92400e" :
                                    (notice as any).LoaiTB === "Sự cố" ? "#991b1b" :
                                    "#3730a3",
                                  fontWeight: 600,
                                  mt: 0.5,
                                }}
                              >
                                {(notice as any).LoaiTB}
                              </Typography>
                            )}
                          </Box>
                          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                            {notice.ThoiGian 
                              ? new Date(notice.ThoiGian).toLocaleString("vi-VN")
                              : (notice.NgayTao && notice.GioTao 
                                  ? `${notice.NgayTao} ${notice.GioTao}`
                                  : "Chưa có thời gian")}
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.6, fontSize: 15 }}>
                          {notice.NoiDung}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default AdminNotifyPage
