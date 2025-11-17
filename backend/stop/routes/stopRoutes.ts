import express from 'express';
import {
  getAllStops,
  getStopById,
  createStop,
  updateStop,
  deleteStop,
} from '../controllers/stopController.js';

const router = express.Router();

router.get('/', getAllStops);           // Lấy tất cả trạm dừng
router.get('/:id', getStopById);        // Lấy trạm dừng theo ID
router.post('/', createStop);           // Tạo trạm dừng mới
router.put('/:id', updateStop);         // Cập nhật trạm dừng
router.delete('/:id', deleteStop);      // Xóa trạm dừng

export default router;
