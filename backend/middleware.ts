// backend/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ssb10_2025_ok_done";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization header:", authHeader); // debug
  if (!authHeader) return res.status(401).json({ message: "Chưa có token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.VaiTro !== 2) return res.status(403).json({ message: "Không có quyền" });

    (req as any).user = decoded;
    next();
  } catch (err) {
    console.error("Token lỗi:", err);
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};
