import { pool } from "../../config/db"

export interface ITripMonthlyData {
  month: number
  trips: number
}

// Hàm lấy thống kê chuyến xe theo 12 tháng của năm
export const getTripsMonthly = async (yearStr?: string): Promise<ITripMonthlyData[]> => {
  try {
    // yearStr format: "2025" hoặc null/undefined → lấy năm hiện tại
    let targetYear = yearStr
    if (!targetYear) {
      const now = new Date()
      targetYear = String(now.getFullYear())
    }

    console.log(`[Backend] Getting stats for year: ${targetYear}`)

    // Dựa trên file mẫu bạn cung cấp, project đang dùng thư viện mysql2/promise
    const [rows]: any = await pool.query(
      `SELECT 
        MONTH(Ngay) as month, 
        COUNT(*) as trips
      FROM LichTrinh
      WHERE YEAR(Ngay) = ?
      GROUP BY MONTH(Ngay)
      ORDER BY month ASC`,
      [targetYear],
    )

    console.log(`[Backend] Found ${Array.isArray(rows) ? rows.length : 0} rows`)

    // Tạo mảng đủ 12 tháng (mặc định 0 chuyến)
    const fullYearData: ITripMonthlyData[] = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1, // Tháng 1 đến 12
      trips: 0,
    }))

    // Map dữ liệu từ DB vào mảng đủ 12 tháng
    if (Array.isArray(rows)) {
      rows.forEach((row: any) => {
        // row.month trả về 1-12
        const index = Number(row.month) - 1
        if (fullYearData[index]) {
          fullYearData[index].trips = Number(row.trips)
        }
      })
    }

    return fullYearData
  } catch (error) {
    console.error("[Backend] Error in getTripsMonthly:", error)
    // Trả về mảng rỗng thay vì crash
    return Array.from({ length: 12 }, (_, i) => ({ month: i + 1, trips: 0 }))
  }
}
