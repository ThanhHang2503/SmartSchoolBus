import type { Response } from "express";

export class ResponseHandler {
  static success(res: Response, data: any, message: string = "Success", statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res: Response, message: string = "Error", statusCode: number = 500, error?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }

  static notFound(res: Response, message: string = "Resource not found") {
    return res.status(404).json({
      success: false,
      message,
    });
  }

  static unauthorized(res: Response, message: string = "Unauthorized") {
    return res.status(401).json({
      success: false,
      message,
    });
  }

  static forbidden(res: Response, message: string = "Forbidden") {
    return res.status(403).json({
      success: false,
      message,
    });
  }

  static badRequest(res: Response, message: string = "Bad request") {
    return res.status(400).json({
      success: false,
      message,
    });
  }
}