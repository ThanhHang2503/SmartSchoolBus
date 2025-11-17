import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail'; // <-- Import thư viện SendGrid


// Load biến môi trường từ file .env
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