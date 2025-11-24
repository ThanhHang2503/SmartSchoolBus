import type { Request, Response, NextFunction } from "express";

// Wrapper để xử lý async/await trong Express routes
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};