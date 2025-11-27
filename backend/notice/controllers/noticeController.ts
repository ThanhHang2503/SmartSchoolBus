// controllers/noticeController.ts
import { Request, Response } from "express";
import { createNotice, getNoticesByUser, getAllNotices } from "../models/noticeModel";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ssb10_2025_ok_done";

// Helper function để lấy MaTK từ token
const getMaTKFromToken = (req: Request): number | undefined => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return undefined;
    
    const token = authHeader.split(" ")[1];
    if (!token) return undefined;
    
    // Decode token (verify để đảm bảo token hợp lệ)
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return Number(decoded.userId || decoded.id || decoded.MaTK);
  } catch (err) {
    // Nếu token không hợp lệ, không báo lỗi, chỉ return undefined
    console.log("Không thể lấy MaTK từ token (có thể không có token hoặc token không hợp lệ)");
    return undefined;
  }
};

// Lọc danh sách người nhận: chỉ cho phép tài xế và phụ huynh, loại bỏ admin và người gửi
const filterValidReceivers = async (receivers: number[], senderMaTK?: number): Promise<number[]> => {
  if (receivers.length === 0) return [];
  
  // Lấy VaiTro của tất cả receivers
  const placeholders = receivers.map(() => '?').join(',');
  const [rows]: any = await pool.query(
    `SELECT MaTK, VaiTro FROM TaiKhoan WHERE MaTK IN (${placeholders}) AND TrangThai = 1`,
    receivers
  );
  
  // Chỉ lấy những người có VaiTro = 1 (Phụ huynh) hoặc VaiTro = 3 (Tài xế)
  // Loại bỏ VaiTro = 2 (Quản lý/Admin) và người gửi
  const validReceivers = rows
    .filter((row: any) => {
      const isParentOrDriver = row.VaiTro === 1 || row.VaiTro === 3;
      const isNotSender = !senderMaTK || row.MaTK !== senderMaTK;
      return isParentOrDriver && isNotSender;
    })
    .map((row: any) => row.MaTK);
  
  return validReceivers;
};

export const sendNotice = async (req: Request, res: Response) => {
  const { content, receivers, senderMaTK: senderMaTKFromBody } = req.body;

  // Lấy MaTK từ token (ưu tiên) hoặc từ request body
  const senderMaTK = getMaTKFromToken(req) || senderMaTKFromBody;

  // Validate
  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ message: "Nội dung thông báo không được để trống" });
  }
  if (!Array.isArray(receivers) || receivers.length === 0) {
    return res.status(400).json({ message: "Phải chọn ít nhất một người nhận" });
  }
  if (receivers.some((id: any) => typeof id !== "number" || id <= 0)) {
    return res.status(400).json({ message: "Mã tài khoản không hợp lệ" });
  }

  try {
    console.log('POST /notice payload:', { content, receivers, senderMaTK, tokenSource: getMaTKFromToken(req) ? 'token' : 'body' });
    
    // Lọc danh sách người nhận: loại bỏ admin và người gửi
    const filteredReceivers = await filterValidReceivers(receivers, senderMaTK);
    
    if (filteredReceivers.length === 0) {
      return res.status(400).json({ 
        message: "Không có người nhận hợp lệ. Admin chỉ có thể gửi thông báo cho tài xế và phụ huynh." 
      });
    }
    
    const result = await createNotice(content.trim(), filteredReceivers);
    console.log('createNotice result:', result);

    // Trả về dữ liệu đẹp cho frontend (chỉ những người thực sự nhận được)
    const now = new Date();
    const responseData = filteredReceivers.map(MaTK => ({
      MaTB: result.MaTB,
      NoiDung: content.trim(),
      NgayTao: now.toLocaleDateString("vi-VN"),
      GioTao: now.toLocaleTimeString("vi-VN"),
      ThoiGian: now.toISOString(),
      MaTK,
    }));

    return res.status(201).json(responseData);
  } catch (err) {
    console.error("Lỗi gửi thông báo:", err);
    // Nếu err có message từ model, trả về chi tiết hơn
    const message = (err && (err as any).message) ? (err as any).message : "Gửi thông báo thất bại";
    return res.status(500).json({ message });
  }
};

export const fetchNotices = async (req: Request, res: Response) => {
  const MaTK = Number(req.params.MaTK);
  if (isNaN(MaTK) || MaTK <= 0) {
    return res.status(400).json({ message: "MaTK không hợp lệ" });
  }

  try {
    const notices = await getNoticesByUser(MaTK);
    return res.json(notices);
  } catch (err) {
    console.error("Lỗi lấy thông báo:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy tất cả thông báo (cho admin xem lịch sử)
export const fetchAllNotices = async (req: Request, res: Response) => {
  try {
    const notices = await getAllNotices();
    return res.json(notices);
  } catch (err) {
    console.error("Lỗi lấy tất cả thông báo:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};