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
      //   setSelectedUser(null)
      //   setSuccess(true)
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
                      Tất cả người dùng
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
                          label={selectedUser.type === "driver" ? "Tài xế" : "Phụ huynh"}
                          size="small"
                          sx={{
                            background: selectedUser.type === "driver" ? "#dbeafe" : "#e9d5ff",
                            color: selectedUser.type === "driver" ? "#1e40af" : "#6b21a8",
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

              <Divider sx={{ borderColor: "#e2e8f0" }} />

              {/* History List - Increased maxHeight and padding */}
              <List sx={{ flex: 1, overflowY: "auto", p: 0}}>
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
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1e293b" }}>
                            {selectedUser ? selectedUser.name : "Thông báo hệ thống"}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                            {new Date(notice.ThoiGian || "").toLocaleString("vi-VN")}
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
