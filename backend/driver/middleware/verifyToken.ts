//Để bảo vệ route và lấy driverId từ token:

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ssb10_2025_ok_done";

export interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization; // "Bearer <token>"
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token format invalid" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded; // lưu thông tin user trong request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware riêng cho Driver (có thể thêm kiểm tra vai trò nếu cần)
export const driverMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(403).json({ message: "Forbidden: No user data" });
  }
  
  // Kiểm tra cả role (text) và VaiTro (number)
  const isDriver = req.user.role === "driver" || req.user.VaiTro === 3;
  
  if (isDriver) {
    next();
  } else {
    res.status(403).json({ 
      message: "Forbidden: Drivers only",
      userRole: req.user.role,
      userVaiTro: req.user.VaiTro
    });
  }
};
