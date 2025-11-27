import express from 'express';
import {
  getAllNotifications,
  getNotificationsByAccount,
  createAndSendNotification,
  deleteNotification,
} from '../Controllers/NotificationController';

const router = express.Router();

router.get('/', getAllNotifications);                           // Lấy tất cả thông báo
router.get('/account/:maTK', getNotificationsByAccount);        // Lấy thông báo theo tài khoản
router.post('/', createAndSendNotification);                    // Tạo và gửi thông báo
router.delete('/:id', deleteNotification);                      // Xóa thông báo

export default router;
