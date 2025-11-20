"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

export interface Notification {
  MaTB: number;
  NoiDung: string;
  LoaiTB: string;
  ThoiGian: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: () => void;
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Kết nối Socket.IO
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket"],
      reconnection: true,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket.IO connected");
      setIsConnected(true);

      // Đăng ký user vào room
      newSocket.emit("register", {
        userId: user.id,
        role: user.role === "parent" ? 1 : user.role === "admin" ? 2 : 3,
      });
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket.IO disconnected");
      setIsConnected(false);
    });

    // Lắng nghe thông báo mới
    newSocket.on("notification", (notification: Notification) => {
      console.log("🔔 Thông báo mới:", notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Hiển thị browser notification nếu được phép
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification("Thông báo mới", {
          body: notification.NoiDung,
          icon: "/icon.png",
        });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Request browser notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const markAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, isConnected }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications phải dùng trong NotificationProvider");
  return context;
};
