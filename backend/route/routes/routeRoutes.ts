import express from 'express';
import {
  getAllRoutes,
  getRouteById,
  getRouteWithStops,
  addRoute,
  addStopToRoute,
  updateRoute,
  removeStopFromRoute,
  deleteRoute,
} from '../controllers/routeController';

const router = express.Router();

// Tuyến đường
router.get('/', getAllRoutes);                          // Lấy tất cả tuyến đường
router.post('/', addRoute);                             // Tạo tuyến đường mới

// Quản lý trạm trong tuyến đường (phải đặt trước /:id để tránh conflict)
router.post('/stops', addStopToRoute);                  // Thêm trạm vào tuyến đường

// Routes với ID (phải đặt sau routes cụ thể)
router.get('/:id', getRouteById);                       // Lấy tuyến đường theo ID
router.get('/:id/stops', getRouteWithStops);            // Lấy tuyến đường với danh sách trạm
router.put('/:id', updateRoute);                        // Cập nhật tuyến đường
router.delete('/:id', deleteRoute);                     // Xóa tuyến đường
router.delete('/:maTD/stops/:maTram', removeStopFromRoute); // Xóa trạm khỏi tuyến đường

export default router;