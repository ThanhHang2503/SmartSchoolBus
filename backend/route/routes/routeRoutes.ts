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
} from '../controllers/routeController.js';

const router = express.Router();

// Tuyến đường
router.get('/', getAllRoutes);                          // Lấy tất cả tuyến đường
router.get('/:id', getRouteById);                       // Lấy tuyến đường theo ID
router.get('/:id/stops', getRouteWithStops);            // Lấy tuyến đường với danh sách trạm
router.post('/', addRoute);                             // Tạo tuyến đường mới
router.put('/:id', updateRoute);                        // Cập nhật tuyến đường
router.delete('/:id', deleteRoute);                     // Xóa tuyến đường

// Quản lý trạm trong tuyến đường
router.post('/stops', addStopToRoute);                  // Thêm trạm vào tuyến đường
router.delete('/:maTD/stops/:maTram', removeStopFromRoute); // Xóa trạm khỏi tuyến đường

export default router;
