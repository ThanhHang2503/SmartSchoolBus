// backend/Notification/Controllers/NotificationController.ts
import { Request, Response } from 'express';
import {
  getAllNotifications as getAllNotificationsModel,
  getNotificationById,
  getNotificationsByAccount as getNotificationsByAccountModel,
  createNotification,
  sendNotificationToAccount,
  sendNotificationToAccounts,
  sendNotificationByRole,
  deleteNotification as deleteNotificationModel,
} from '../Models/notificationModel';

// GET /api/notifications
export const getAllNotifications = async (_req: Request, res: Response) => {
  try {
    const notifications = await getAllNotificationsModel();
    res.json({ success: true, data: notifications });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Lỗi server' });
  }
};

// GET /api/notifications/:id (không dùng trong routes hiện tại, nhưng giữ lại để tương lai)
export const getNotificationByIdCtrl = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id || '');
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
    }

    const noti = await getNotificationById(id);
    if (!noti) {
      return res.status(404).json({ success: false, message: 'Thông báo không tồn tại' });
    }

    res.json({ success: true, data: noti });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Lỗi server' });
  }
};

// GET /api/notifications/account/:maTK
export const getNotificationsByAccount = async (req: Request, res: Response) => {
  try {
    const maTK = parseInt(req.params.maTK || '');
    if (isNaN(maTK)) {
      return res.status(400).json({ success: false, message: 'MaTK không hợp lệ' });
    }

    const list = await getNotificationsByAccountModel(maTK);
    res.json({ success: true, data: list });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Lỗi server' });
  }
};

// POST /api/notifications → Tạo + gửi luôn
export const createAndSendNotification = async (req: Request, res: Response) => {
  try {
    // Fix lỗi TypeScript: lấy dữ liệu an toàn
    const NoiDung: string | undefined = req.body.NoiDung;
    const LoaiTB: string | undefined = req.body.LoaiTB;
    const MaTKList: unknown = req.body.MaTKList;
    const Role: unknown = req.body.Role;
    const senderMaTK: number | undefined = req.body.senderMaTK; // MaTK của người gửi

    // Validate nội dung
    if (!NoiDung || typeof NoiDung !== 'string' || NoiDung.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Nội dung thông báo không được để trống',
      });
    }

    // Tạo thông báo
    const maTB = await createNotification({ 
      NoiDung: NoiDung.trim(),
      LoaiTB: LoaiTB || 'Khác'
    });

    let sentInfo = 'Chưa gửi cho ai';

    // Ưu tiên gửi theo danh sách tài khoản
    if (Array.isArray(MaTKList)) {
      let validIds = (MaTKList as any[])
        .filter((id): id is number => typeof id === 'number' && !isNaN(id) && id > 0);

      // Loại bỏ người gửi khỏi danh sách người nhận
      if (senderMaTK && typeof senderMaTK === 'number') {
        validIds = validIds.filter(id => id !== senderMaTK);
      }

      if (validIds.length > 0) {
        await sendNotificationToAccounts(maTB, validIds, senderMaTK);
        sentInfo = `Đã gửi cho ${validIds.length} tài khoản`;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Không có người nhận hợp lệ (đã loại bỏ chính bạn)',
        });
      }
    }
    // Gửi theo vai trò
    else if (typeof Role === 'number' && [1, 2, 3].includes(Role)) {
      await sendNotificationByRole(maTB, Role, senderMaTK);
      const roleName = Role === 1 ? 'Phụ huynh' : Role === 2 ? 'Quản lý' : 'Tài xế';
      sentInfo = `Đã gửi cho tất cả ${roleName}`;
    }

    res.status(201).json({
      success: true,
      message: 'Tạo thông báo thành công',
      data: {
        MaTB: maTB,
        sentTo: sentInfo,
      },
    });
  } catch (err: any) {
    console.error('createNotificationCtrl error:', err);
    res.status(500).json({ success: false, message: err.message || 'Lỗi server' });
  }
};

// POST /api/notifications/:id/send-to-account (không dùng trong routes hiện tại)
export const sendToOneAccountCtrl = async (req: Request, res: Response) => {
  try {
    const maTB = parseInt(req.params.id || '');
    const MaTK: unknown = req.body.MaTK;

    if (isNaN(maTB) || typeof MaTK !== 'number' || MaTK <= 0) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
    }

    const noti = await getNotificationById(maTB);
    if (!noti) {
      return res.status(404).json({ success: false, message: 'Thông báo không tồn tại' });
    }

    await sendNotificationToAccount(maTB, MaTK);
    res.json({ success: true, message: 'Đã gửi thông báo đến tài khoản' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Lỗi server' });
  }
};

// POST /api/notifications/:id/send-to-accounts (không dùng trong routes hiện tại)
export const sendToManyAccountsCtrl = async (req: Request, res: Response) => {
  try {
    const maTB = parseInt(req.params.id || '');
    const MaTKList: unknown = req.body.MaTKList;

    if (isNaN(maTB)) {
      return res.status(400).json({ success: false, message: 'ID thông báo không hợp lệ' });
    }
    if (!Array.isArray(MaTKList)) {
      return res.status(400).json({ success: false, message: 'MaTKList phải là mảng' });
    }

    const validIds = (MaTKList as any[])
      .filter((id): id is number => typeof id === 'number' && !isNaN(id) && id > 0);

    if (validIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có tài khoản hợp lệ để gửi' });
    }

    const noti = await getNotificationById(maTB);
    if (!noti) {
      return res.status(404).json({ success: false, message: 'Thông báo không tồn tại' });
    }

    await sendNotificationToAccounts(maTB, validIds);
    res.json({ success: true, message: `Đã gửi thông báo đến ${validIds.length} tài khoản` });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Lỗi server' });
  }
};

// POST /api/notifications/:id/send-by-role (không dùng trong routes hiện tại)
export const sendByRoleCtrl = async (req: Request, res: Response) => {
  try {
    const maTB = parseInt(req.params.id || '');
    const Role: unknown = req.body.Role;

    if (isNaN(maTB) || typeof Role !== 'number' || ![1, 2, 3].includes(Role)) {
      return res.status(400).json({ success: false, message: 'Vai trò không hợp lệ (1, 2, 3)' });
    }

    const noti = await getNotificationById(maTB);
    if (!noti) {
      return res.status(404).json({ success: false, message: 'Thông báo không tồn tại' });
    }

    await sendNotificationByRole(maTB, Role);
    const roleName = Role === 1 ? 'Phụ huynh' : Role === 2 ? 'Quản lý' : 'Tài xế';
    res.json({ success: true, message: `Đã gửi thông báo đến tất cả ${roleName}` });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Lỗi server' });
  }
};

// DELETE /api/notifications/:id
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id || '');
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
    }

    const deleted = await deleteNotificationModel(id);
  if (!deleted) {
      return res.status(404).json({ success: false, message: 'Thông báo không tồn tại hoặc đã bị xóa' });
    }

    res.json({ success: true, message: 'Xóa thông báo thành công' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Lỗi server' });
  }
};