import { Request, Response, NextFunction } from "express";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];

  if (token === "duyen-secret-token") {
    next(); // Cho phép đi tiếp
  } else {
    res.status(401).json({ message: "Unauthorized: Token không hợp lệ" });
  }
};
