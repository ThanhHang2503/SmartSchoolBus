// controllers/noticeController.ts
import { Request, Response } from "express";
import { createNotice, getNoticesByUser } from "../models/noticeModel";

export const sendNotice = async (req: Request, res: Response) => {
  const { content, receivers } = req.body;

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
    const result = await createNotice(content.trim(), receivers);

    // Trả về dữ liệu đẹp cho frontend
    const now = new Date();
    const responseData = receivers.map(MaTK => ({
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
    return res.status(500).json({ message: "Gửi thông báo thất bại" });
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