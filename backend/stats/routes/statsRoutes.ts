import express from "express"
import { getTripsMonthlyController } from "../controllers/statsController"

const router = express.Router()

// Định nghĩa route lấy thống kê theo tháng
router.get("/trips-monthly", getTripsMonthlyController)

export default router
