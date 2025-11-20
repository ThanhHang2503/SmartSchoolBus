import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  // Kết nối Socket.IO
  connect(userId: number, role: number) {
    if (this.isConnected) return;

    this.socket = io('http://localhost:5000', {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO connected');
      this.isConnected = true;

      // Đăng ký vào room của user và role
      this.socket?.emit('register', { userId, role });
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected');
      this.isConnected = false;
    });

    // Lắng nghe thông báo realtime
    this.socket.on('notification', (notification) => {
      console.log('🔔 Nhận thông báo mới:', notification);
      
      // Hiển thị notification trong UI (có thể dùng toast, alert, etc.)
      this.showNotification(notification);
    });

    // Lắng nghe vị trí xe bus realtime
    this.socket.on('bus_location', (data) => {
      console.log('🚌 Vị trí xe bus:', data);
      // Update map với vị trí mới
    });
  }

  // Hiển thị thông báo
  private showNotification(notification: any) {
    // TODO: Tích hợp với UI notification system
    // Ví dụ: sử dụng react-toastify, antd notification, etc.
    alert(`🔔 ${notification.LoaiTB}: ${notification.NoiDung}`);
  }

  // Ngắt kết nối
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  // Gửi vị trí xe bus (cho tài xế)
  updateBusLocation(busId: number, latitude: number, longitude: number) {
    this.socket?.emit('update_bus_location', {
      busId,
      latitude,
      longitude,
    });
  }
}

export const socketService = new SocketService();
