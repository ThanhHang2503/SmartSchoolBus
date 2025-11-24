const express = require('express');
const {
  getAllStops,
  getStopById,
  createStop,
  updateStop,
  deleteStop,
} = require('../controllers/stopController');

const router = express.Router();

router.get('/', getAllStops);           // Lấy tất cả trạm dừng
router.get('/:id', getStopById);        // Lấy trạm dừng theo ID
router.post('/', createStop);           // Tạo trạm dừng mới
router.put('/:id', updateStop);         // Cập nhật trạm dừng
router.delete('/:id', deleteStop);      // Xóa trạm dừng

module.exports = router;