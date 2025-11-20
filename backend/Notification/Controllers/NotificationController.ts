import type { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { ResponseHandler } from '../../utils/responseHandler.js';
import * as notificationModel from '../Models/notificationModel.js';
import { getIO } from '../../config/socket.js';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();
// Định nghĩa kiểu dữ liệu cho một email
interface EmailOptions {
  to: string;
  subject: string;
  body: string; // Đây là HTML
}

class EmailService {
  private fromEmail: string;

  constructor() {
    // Lấy API key từ file .env
    const apiKey = process.env.SENDGRID_API_KEY;

    if (!apiKey) {
      console.error('SENDGRID_API_KEY không được tìm thấy. Hãy kiểm tra file .env');
      throw new Error('Missing SendGrid API Key');
    }

    sgMail.setApiKey(apiKey);

    // QUAN TRỌNG: Bạn phải dùng email mà bạn đã xác thực với SendGrid
    this.fromEmail = 'lequoccuong2204@gmail.com'; 
  }

  /**
   * Gửi một email cơ bản
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    const msg = {
      to: options.to,
      from: this.fromEmail, // Email bạn đã xác thực
      subject: options.subject,
      html: options.body, // Dùng 'html' thay vì 'text' nếu body là HTML
    };

    console.log('--- Đang chuẩn bị gửi email qua SendGrid ---');
    
    try {
      // Đây là logic gửi email thật
      await sgMail.send(msg);

      console.log('Email đã gửi thành công tới:', options.to);
      return true;

    } catch (error: any) {
      // Xử lý lỗi từ SendGrid
      console.error('Lỗi khi gửi email:', error);
      if (error.response) {
        console.error(error.response.body)
      }
      return false;
    }
  }

  /**
   * Gửi email chào mừng người dùng mới
   */
  async sendWelcomeEmail(to: string, name: string) {
    const subject = `Chào mừng ${name} đến với dịch vụ!`;

    // TODO: Đọc nội dung từ file template
    const body = `<h1>Chào ${name},</h1><p>Cảm ơn bạn đã đăng ký.</p>`;

    return this.sendEmail({ to, subject, body });
  }
}

// Xuất ra một instance duy nhất (Singleton Pattern)
export const emailService = new EmailService();

// ==================== NOTIFICATION CONTROLLERS ====================

// Lấy tất cả thông báo
export const getAllNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await notificationModel.getAllNotifications();
  ResponseHandler.success(res, notifications, 'Lấy danh sách thông báo thành công');
});

// Lấy thông báo theo tài khoản
export const getNotificationsByAccount = asyncHandler(async (req: Request, res: Response) => {
  const maTK = parseInt(req.params.maTK!);
  const notifications = await notificationModel.getNotificationsByAccount(maTK);
  ResponseHandler.success(res, notifications, 'Lấy thông báo thành công');
});

// Tạo và gửi thông báo REALTIME 🚀
export const createAndSendNotification = asyncHandler(async (req: Request, res: Response) => {
  const { NoiDung, LoaiTB, recipients, role } = req.body;

  if (!NoiDung || !LoaiTB) {
    return ResponseHandler.badRequest(res, 'Thiếu thông tin bắt buộc');
  }

  // Tạo thông báo trong database
  const maTB = await notificationModel.createNotification({ NoiDung, LoaiTB });

  // Gửi đến người nhận trong database
  if (recipients && Array.isArray(recipients)) {
    await notificationModel.sendNotificationToAccounts(maTB, recipients);
  } else if (role) {
    await notificationModel.sendNotificationByRole(maTB, role);
  }

  // 🚀 GỬI THÔNG BÁO REALTIME QUA SOCKET.IO
  const io = getIO();
  const notification = {
    MaTB: maTB,
    NoiDung,
    LoaiTB,
    ThoiGian: new Date()
  };

  if (recipients && Array.isArray(recipients)) {
    // Gửi đến từng người dùng cụ thể
    recipients.forEach(maTK => {
      io.to(`user_${maTK}`).emit('notification', notification);
    });
  } else if (role) {
    // Broadcast theo role (1=PhuHuynh, 2=QuanLy, 3=TaiXe)
    io.to(`role_${role}`).emit('notification', notification);
  }

  ResponseHandler.success(res, { MaTB: maTB }, '🚀 Đã gửi thông báo realtime!', 201);
});

// Xóa thông báo
export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id!);
  const deleted = await notificationModel.deleteNotification(id);

  if (!deleted) {
    return ResponseHandler.notFound(res, 'Không tìm thấy thông báo');
  }

  ResponseHandler.success(res, null, 'Xóa thông báo thành công');
});