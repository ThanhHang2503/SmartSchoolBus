'use client';
import Map from "@/compoments/Map"
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Badge,
  Divider,
} from '@mui/material';

type UserType = 'driver' | 'parent';

type ChatUser = {
  id: string;
  name: string;
  type: UserType;
};

type Message = {
  id: number;
  sender: 'admin' | 'driver' | 'parent';
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
};

const AdminDashboard = () => {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([
    { id: 'd1', name: 'Tài xế A', type: 'driver' },
    { id: 'd2', name: 'Tài xế B', type: 'driver' },
    { id: 'p1', name: 'Phụ huynh bé An', type: 'parent' },
    { id: 'p2', name: 'Phụ huynh bé Bình', type: 'parent' },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'driver', receiverId: 'admin', content: 'Xe A đang đến trạm A', timestamp: '10:00', read: false },
    { id: 2, sender: 'admin', receiverId: 'd1', content: 'Đã nhận, chuẩn bị đón học sinh', timestamp: '10:01', read: true },
    { id: 3, sender: 'parent', receiverId: 'admin', content: 'Bé An đã lên xe chưa?', timestamp: '10:02', read: false },
  ]);

  const [activeUser, setActiveUser] = useState<ChatUser | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim() || !activeUser) return;
    const msg: Message = {
      id: messages.length + 1,
      sender: 'admin',
      receiverId: activeUser.id,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString(),
      read: true,
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  const getConversation = () => {
    if (!activeUser) return [];
    return messages.filter(
      msg =>
        (msg.sender === 'admin' && msg.receiverId === activeUser.id) ||
        (msg.sender === activeUser.type && msg.receiverId === 'admin')
    );
  };

  const hasUnreadMessages = (userId: string) => {
    return messages.some(
      msg => msg.sender !== 'admin' && msg.receiverId === 'admin' && msg.read === false && msg.sender === getUserType(userId)
    );
  };

  const getUserType = (id: string): UserType => {
    return chatUsers.find(u => u.id === id)?.type || 'driver';
  };

  useEffect(() => {
    if (activeUser) {
      setMessages(prev =>
        prev.map(msg =>
          msg.receiverId === 'admin' && msg.sender === activeUser.type ? { ...msg, read: true } : msg
        )
      );
    }
  }, [activeUser]);

  const filteredUsers = chatUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Grid container spacing={2} sx={{ height: '100vh', padding: 2 }}>
      {/* Sidebar người dùng */}
      <Grid size={{xs:3}}>
        <Paper sx={{ height: '100%', padding: 2 }}>
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
            {filteredUsers.map(user => (
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
      <Grid size={{xs:5}} >
        <Paper sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Map/>
        </Paper>
      </Grid>

      {/* Chat panel */}
      <Grid size={{xs:4}}>
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 2 }}>
          <Typography variant="h6">
            {activeUser ? `Đang chat với ${activeUser.name}` : 'Chọn người để bắt đầu chat'}
          </Typography>
          <Box sx={{ flex: 1, overflowY: 'auto', marginY: 2 }}>
            <List>
              {getConversation().map(msg => (
                <ListItemButton key={msg.id} sx={{ justifyContent: msg.sender === 'admin' ? 'flex-end' : 'flex-start' }}>
                  <Paper
                    sx={{
                      padding: 1,
                      backgroundColor: msg.sender === 'admin' ? 'primary.main' : 'grey.300',
                      color: msg.sender === 'admin' ? 'white' : 'black',
                      maxWidth: '80%',
                    }}
                  >
                    <ListItemText primary={msg.content} secondary={msg.timestamp} />
                  </Paper>
                </ListItemButton>
              ))}
            </List>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              disabled={!activeUser}
            />
            <Button variant="contained" onClick={sendMessage} disabled={!activeUser}>
              Gửi
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
