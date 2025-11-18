"use client";
import Map from "@/components/Map";
import {
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

// Đã sửa: Import từ các file API cụ thể đã tạo
import { getAllParents } from "@/api/parentApi"; 
import { getAllDrivers } from "@/api/driverApi"; 

// Khai báo lại cấu trúc dữ liệu chung cho Frontend
type UserType = "driver" | "parent";

type ChatUser = {
  id: string; // ID của người dùng (MaPH/MaTX) dưới dạng string
  name: string; // Tên hiển thị (ví dụ: "PH: Nguyễn Văn A")
  type: UserType;
};

type Message = {
  id: number;
  sender: "admin" | "driver" | "parent";
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
};

const AdminDashboard = () => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeUser, setActiveUser] = useState<ChatUser | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // =======================================================
  // Fetch cả Phụ huynh và Tài xế từ backend
  // =======================================================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Gọi song song các API backend
        // Chú ý: Dữ liệu trả về từ API đã được đảm bảo có trường 'id' và 'name' (HoTen)
        const [parentsData, driversData] = await Promise.all([
          getAllParents(), 
          getAllDrivers(), 
        ]);

        // 1. Chuyển đổi dữ liệu Phụ huynh
        const parents: ChatUser[] = parentsData.map((p: any) => ({
          id: p.id.toString(), // Chuyển MaPH (id) sang string
          name: `PH: ${p.name}`, // p.name là HoTen
          type: "parent",
        }));

        // 2. Chuyển đổi dữ liệu Tài xế
        const drivers: ChatUser[] = driversData.map((d: any) => ({
          id: d.id.toString(), // Chuyển MaTX (id) sang string
          name: `TX: ${d.name}`, // d.name là HoTen
          type: "driver",
        }));

        // 3. Kết hợp và cập nhật state
        setChatUsers([...parents, ...drivers]);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách người dùng chat:", err);
      }
    };
    fetchUsers();
  }, []); // Dependency array rỗng đảm bảo chỉ chạy một lần

  const sendMessage = () => {
    if (!newMessage.trim() || !activeUser) return;
    const msg: Message = {
      id: messages.length + 1,
      sender: "admin",
      receiverId: activeUser.id,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString(),
      read: true,
    };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  const getConversation = () => {
    if (!activeUser) return [];
    return messages.filter(
      (msg) =>
        (msg.sender === "admin" && msg.receiverId === activeUser.id) ||
        (msg.sender === activeUser.type && msg.receiverId === "admin")
    );
  };

  const hasUnreadMessages = (userId: string) => {
    return messages.some(
      (msg) =>
        msg.sender !== "admin" &&
        msg.receiverId === "admin" &&
        msg.read === false &&
        msg.sender === getUserType(userId)
    );
  };

  const getUserType = (id: string): UserType => {
    return chatUsers.find((u) => u.id === id)?.type || "driver";
  };

  useEffect(() => {
    if (activeUser) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.receiverId === "admin" && msg.sender === activeUser.type
            ? { ...msg, read: true }
            : msg
        )
      );
    }
  }, [activeUser]);

  const filteredUsers = chatUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Grid spacing={2} sx={{ height: "100vh", padding: 2 }}>
      {/* Sidebar người dùng */}
      <Grid item xs={3}> 
        <Paper sx={{ height: "100%", padding: 2 }}>
          <Typography variant="h6">Danh sách liên hệ</Typography>
          <Divider sx={{ my: 1 }} />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          <List>
            {filteredUsers.map((user) => (
              <ListItemButton
                key={user.id}
                selected={activeUser?.id === user.id}
                onClick={() => setActiveUser(user)}
              >
                <ListItemText primary={user.name} />
                {hasUnreadMessages(user.id) && (
                  <Badge color="error" variant="dot" sx={{ ml: 1 }} />
                )}
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Map placeholder */}
      <Grid item xs={5}>
        <Paper
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Map />
        </Paper>
      </Grid>

      {/* Chat panel */}
      <Grid item xs={4}>
        <Paper
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: 2,
          }}
        >
          <Typography variant="h6">
            {activeUser ? ` ${activeUser.name}` : "Chọn người để bắt đầu chat"}
          </Typography>
          <Box sx={{ flex: 1, overflowY: "auto", marginY: 2 }}>
            <List>
              {getConversation().map((msg) => (
                <ListItemButton
                  key={msg.id}
                  sx={{
                    justifyContent:
                      msg.sender === "admin" ? "flex-end" : "flex-start",
                  }}
                >
                  <Paper
                    sx={{
                      padding: 1,
                      backgroundColor:
                        msg.sender === "admin" ? "primary.main" : "grey.300",
                      color: msg.sender === "admin" ? "white" : "black",
                      maxWidth: "80%",
                    }}
                  >
                    <ListItemText
                      primary={msg.content}
                      secondary={msg.timestamp}
                    />
                  </Paper>
                </ListItemButton>
              ))}
            </List>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={!activeUser}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={!activeUser}
            >
              Gửi
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;