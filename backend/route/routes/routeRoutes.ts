import express from 'express'
import {
  getAllRoutes,
  getRouteById,
  addRoute,
  updateRoute,
  deleteRoute,
} from '../controllers/routeController';

const router = express.Router();

// CRUD endpoints
router.get('/', getAllRoutes); // Lấy tất cả routes
router.get('/:id', getRouteById); // Lấy route theo id
router.post('/', addRoute); // Thêm mới route
router.put('/:id', updateRoute); // Cập nhật route
router.delete('/:id', deleteRoute); // Xóa route

export default router;
