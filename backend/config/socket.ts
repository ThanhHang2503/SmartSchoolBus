import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '../utils/logger.js';

let io: SocketIOServer;

export const initializeSocket = (server: HTTPServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`🔌 Client connected: ${socket.id}`);

    // Đăng ký người dùng vào room theo MaTK
    socket.on('register', (data: { maTK: number; role: number }) => {
      socket.join(`user_${data.maTK}`);
      socket.join(`role_${data.role}`);
      logger.info(`User ${data.maTK} joined rooms: user_${data.maTK}, role_${data.role}`);
    });

    // Gửi thông báo realtime
    socket.on('send_notification', (notification: any) => {
      if (notification.recipients) {
        // Gửi đến danh sách cụ thể
        notification.recipients.forEach((maTK: number) => {
          io.to(`user_${maTK}`).emit('notification', notification);
        });
      } else if (notification.role) {
        // Broadcast theo role
        io.to(`role_${notification.role}`).emit('notification', notification);
      }
    });

    // Cập nhật vị trí xe bus realtime (cho tài xế)
    socket.on('update_bus_location', (data: { busId: number; lat: number; lng: number }) => {
      io.emit('bus_location_updated', data);
      logger.debug(`Bus ${data.busId} location updated: ${data.lat}, ${data.lng}`);
    });

    socket.on('disconnect', () => {
      logger.info(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  logger.info('✅ Socket.IO initialized');
  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};
