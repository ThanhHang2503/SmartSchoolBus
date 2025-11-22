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
  Alert,
  Chip,
  Container,
  LinearProgress,
  Fade,
} from "@mui/material"
import { useEffect, useState } from "react"
import SendIcon from "@mui/icons-material/Send"
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive"
import HistoryIcon from "@mui/icons-material/History"
import PeopleIcon from "@mui/icons-material/People"
import ErrorIcon from "@mui/icons-material/Error"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

import { getAllParents } from "@/api/parentApi"
import { getAllDrivers } from "@/api/driverApi"
import { getNoticesByUser, sendNotice, type INotice } from "@/api/noticeApi"

type UserType = "driver" | "parent"
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [generalHistory, setGeneralHistory] = useState<INotice[]>([])
  const [singleHistory, setSingleHistory] = useState<INotice[]>([])

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
        const [parentsRes, driversRes] = await Promise.all([getAllParents(), getAllDrivers()])

        const activeParents = (parentsRes || []).filter((p: any) => p.Active === 1)
        const activeDrivers = (driversRes || []).filter((d: any) => d.Active === 1)

        const parentList: ChatUser[] = activeParents.map((p: any) => ({
          id: `parent-${p.MaPH}`,
          rawId: String(p.MaTK),
          name: p.HoTen,
          type: "parent" as const,
          extraId: p.MaPH,
        }))

        const driverList: ChatUser[] = activeDrivers.map((d: any) => ({
          id: `driver-${d.MaTX}`,
          rawId: String(d.MaTK),
          name: d.HoTen,
          type: "driver" as const,
          extraId: d.MaTX,
        }))

        setChatUsers([...driverList, ...parentList])
      } catch (err) {
        console.error("Lỗi tải danh sách người dùng:", err)
        setError("Không thể tải danh sách người dùng. Vui lòng thử lại.")
      }
    }

    fetchUsers()
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

    let receivers: number[] = []

    switch (noticeType) {
      case "all":
        receivers = chatUsers.map((u) => Number(u.rawId))
        break
      case "all-driver":
        receivers = chatUsers.filter((u) => u.type === "driver").map((u) => Number(u.rawId))
        break
      case "all-parent":
        receivers = chatUsers.filter((u) => u.type === "parent").map((u) => Number(u.rawId))
        break
      case "single":
        if (!selectedUser) {
          setError("Vui lòng chọn người nhận!")
          return
        }
        receivers = [Number(selectedUser.rawId)]
        break
    }

    console.log("Gửi thông báo:", {
      noticeType,
      receivers: receivers.length + " người",
    })

    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      await sendNotice(content.trim(), receivers)

      const now = new Date()
      const newNotice: INotice = {
        MaTB: Date.now(),
        NoiDung: content.trim(),
        NgayTao: now.toLocaleDateString("vi-VN"),
        GioTao: now.toLocaleTimeString("vi-VN"),
        ThoiGian: now.toISOString(),
        MaTK: noticeType === "single" ? Number(selectedUser?.rawId) : 0,
      }

      if (noticeType === "single") {
        setSingleHistory((prev) => [newNotice, ...prev])
      } else {
        setGeneralHistory((prev) => [
          {
            ...newNotice,
            NoiDung:
              noticeType === "all"
                ? `Đã gửi cho tất cả (${receivers.length} người)`
                : noticeType === "all-driver"
                  ? `Đã gửi cho tất cả tài xế (${receivers.length} người)`
                  : `Đã gửi cho tất cả phụ huynh (${receivers.length} người)`,
          },
          ...prev,
        ])
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

  const historyToShow = selectedUser ? singleHistory : generalHistory
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
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #3b82f6 0%, #1e3a8a 100%)",
          backdropFilter: "blur(10px)",
          borderBottom: "2px solid #dbeafe",
          py: 3,
          mb: 4,
          sticky: 0,
          zIndex: 50,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3)",
              }}
            >
              <NotificationsActiveIcon sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                Quản lý thông báo
              </Typography>
              <Typography variant="caption" sx={{ color: "#dbeafe", mt: 0.5 }}>
                Gửi thông báo trực tiếp đến tài xế và phụ huynh
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Success Alert */}
        <Fade in={success}>
          <Box sx={{ mb: 3 }}>
            <Alert
              icon={<CheckCircleIcon />}
              severity="success"
              sx={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                color: "#16a34a",
                fontWeight: 500,
                borderRadius: 2,
              }}
            >
              Gửi thông báo thành công! ✨
            </Alert>
          </Box>
        </Fade>

        {/* Main Grid */}
        <Grid container spacing={3} sx={{ maxWidth: 1200, mx: "auto" }}>
          {/* Form Panel */}
          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                p: 3,
                borderRadius: 3,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
                position: "sticky",
                top: 100,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    background: "#dbeafe",
                    border: "1px solid #93c5fd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SendIcon sx={{ color: "#3b82f6", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    Tạo thông báo
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Soạn nội dung và gửi ngay
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2, borderColor: "#e2e8f0" }} />

              {/* Error Alert */}
              {error && (
                <Fade in={!!error}>
                  <Box sx={{ mb: 2 }}>
                    <Alert
                      icon={<ErrorIcon />}
                      severity="error"
                      sx={{
                        background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(244, 63, 94, 0.05) 100%)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#dc2626",
                        fontWeight: 500,
                        borderRadius: 2,
                      }}
                    >
                      {error}
                    </Alert>
                  </Box>
                </Fade>
              )}

              {/* Notice Type Select */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="caption"
                  sx={{ textTransform: "uppercase", fontWeight: 700, color: "#475569", letterSpacing: "0.05em" }}
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
                    mt: 1,
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    color: "#1e293b",
                    borderRadius: 2,
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
                      Tất cả người dùng
                    </Box>
                  </MenuItem>
                  <MenuItem value="all-driver">Tất cả tài xế ({driverCount})</MenuItem>
                  <MenuItem value="all-parent">Tất cả phụ huynh ({parentCount})</MenuItem>
                  <MenuItem value="single">Gửi cá nhân</MenuItem>
                </Select>
              </Box>

              {/* User Select - Conditional */}
              {noticeType === "single" && (
                <Fade in={noticeType === "single"}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        textTransform: "uppercase",
                        fontWeight: 700,
                        color: "#475569",
                        letterSpacing: "0.05em",
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
                        mt: 1,
                        background: "#f1f5f9",
                        border: "1px solid #cbd5e1",
                        color: "#1e293b",
                        borderRadius: 2,
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
                              label={user.type === "driver" ? "TX" : "PH"}
                              size="small"
                              sx={{
                                background: user.type === "driver" ? "#dbeafe" : "#e9d5ff",
                                color: user.type === "driver" ? "#1e40af" : "#6b21a8",
                                fontWeight: 600,
                                fontSize: 11,
                                border: user.type === "driver" ? "1px solid #93c5fd" : "1px solid #d8b4fe",
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

              {/* Content Textarea */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: "#475569",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Nội dung
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 500 }}>
                    {content.length}/500
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
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
                <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(content.length / 500) * 100}
                    sx={{
                      flex: 1,
                      height: 6,
                      borderRadius: 3,
                      background: "#e2e8f0",
                      "& .MuiLinearProgress-bar": {
                        background: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)",
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 500, minWidth: 35 }}>
                    {Math.round((content.length / 500) * 100)}%
                  </Typography>
                </Box>
              </Box>

              {/* Send Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSendNotice}
                disabled={loading || !content.trim() || (noticeType === "single" && !selectedUser)}
                sx={{
                  height: 48,
                  background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: 15,
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

          {/* History Panel */}
          <Grid item xs={12} md={7}>
            <Paper
              sx={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 3,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  borderBottom: "1px solid #e2e8f0",
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      background: "#dbeafe",
                      border: "1px solid #93c5fd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <HistoryIcon sx={{ color: "#3b82f6", fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                      Lịch sử thông báo
                    </Typography>
                    {selectedUser && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                        <Chip
                          label={selectedUser.type === "driver" ? "Tài xế" : "Phụ huynh"}
                          size="small"
                          sx={{
                            background: selectedUser.type === "driver" ? "#dbeafe" : "#e9d5ff",
                            color: selectedUser.type === "driver" ? "#1e40af" : "#6b21a8",
                            fontWeight: 600,
                          }}
                        />
                        <Typography variant="caption" sx={{ color: "#475569" }}>
                          {selectedUser.name}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ borderColor: "#e2e8f0" }} />

              {/* History List */}
              <List sx={{ maxHeight: "600px", overflowY: "auto" }}>
                {historyToShow.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 6,
                      color: "#94a3b8",
                    }}
                  >
                    <HistoryIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                      Chưa có thông báo nào
                    </Typography>
                    <Typography variant="caption">Thông báo sẽ xuất hiện ở đây</Typography>
                  </Box>
                ) : (
                  historyToShow.map((notice, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        borderBottom: "1px solid #e2e8f0",
                        py: 2,
                        px: 3,
                        "&:last-child": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                            {selectedUser ? selectedUser.name : "Thông báo hệ thống"}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                            {new Date(notice.ThoiGian || "").toLocaleString("vi-VN")}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.5 }}>
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
