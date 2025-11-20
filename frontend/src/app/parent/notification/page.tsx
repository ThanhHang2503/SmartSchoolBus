"use client";

import { useNotifications } from "@/context/NotificationContext";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import { NotificationsActive } from "@mui/icons-material";

export default function NotificationPage() {
  const { notifications, unreadCount, markAsRead, isConnected } = useNotifications();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          <NotificationsActive sx={{ mr: 1, verticalAlign: "middle" }} />
          Thông báo ({unreadCount} mới)
        </Typography>
        
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Chip
            label={isConnected ? "🟢 Đã kết nối" : "🔴 Mất kết nối"}
            color={isConnected ? "success" : "error"}
            size="small"
          />
          {unreadCount > 0 && (
            <Button size="small" variant="outlined" onClick={markAsRead}>
              Đánh dấu đã đọc
            </Button>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 2, maxHeight: 700, overflow: "auto" }}>
        {notifications.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            Chưa có thông báo nào
          </Typography>
        ) : (
          <List>
            {notifications.map((notif, index) => (
              <React.Fragment key={`${notif.MaTB}-${index}`}>
                <ListItem
                  sx={{
                    bgcolor: index < unreadCount ? "action.hover" : "transparent",
                    borderRadius: 1,
                    mb: 1,
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, width: "100%" }}>
                    <Chip label={notif.LoaiTB} size="small" color="primary" />
                    {index < unreadCount && <Chip label="MỚI" size="small" color="error" />}
                    <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                      {new Date(notif.ThoiGian).toLocaleString("vi-VN")}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" sx={{ width: "100%" }}>
                    {notif.NoiDung}
                  </Typography>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
