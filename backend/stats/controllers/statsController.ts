import type { Request, Response } from "express"
import { getTripsMonthly } from "../models/statsModel"

/**
 * API: GET /stats/trips-monthly?year=2025
 * Nếu không có query year → tự động lấy năm hiện tại
 */
export const getTripsMonthlyController = async (req: Request, res: Response) => {
  try {
    // Lấy tham số year từ query string
    const { year } = req.query

    // Kiểm tra định dạng YYYY (ví dụ: 2025)
    let selectedYear: string | undefined
    if (typeof year === "string") {
      const match = year.match(/^\d{4}$/)
      if (match) {
        selectedYear = year // hợp lệ
      } else {
        return res.status(400).json({
          message: "Tham số 'year' không hợp lệ. Vui lòng dùng định dạng YYYY (ví dụ: 2025)",
        })
      }
    }
    // Nếu không có hoặc sai → để undefined → model sẽ tự lấy năm hiện tại

    const tripData = await getTripsMonthly(selectedYear)

    // Trả về dữ liệu 12 tháng
    res.status(200).json(tripData)
  } catch (err: any) {
    res.status(500).json({
      message: "Lỗi máy chủ khi lấy dữ liệu thống kê",
      error: err.message || String(err),
    })
  }
}