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

import { getAllStudents, IStudent } from "@/api/studentApi"; // import API

type UserType = "driver" | "parent";

type ChatUser = {
  id: string;
  name: string;
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

  // Fetch students từ backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const students: IStudent[] = await getAllStudents();
        const parents: ChatUser[] = students.map((s) => ({
          id: s.id,
          name: `Phụ huynh học sinh ${s.name}`,
          type: "parent",
        }));
        setChatUsers(parents);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách học sinh:", err);
      }
    };
    fetchStudents();
  }, []);

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
    <Grid container spacing={2} sx={{ height: "100vh", padding: 2 }}>
      {/* Sidebar người dùng */}
      <Grid size={{ xs: 3 }}>
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
      <Grid size={{ xs: 5 }}>
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
      <Grid size={{ xs: 4 }}>
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
