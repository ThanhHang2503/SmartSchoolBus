// frontend/api/notificationApi.ts

export interface INotification {
  MaTB: number;
  NoiDung: string;
  NgayTao: Date | string;
  GioTao: Date | string;
  LoaiTB?: string; // Loại thông báo
}

export interface INotificationResponse {
  success: boolean;
  data?: INotification[];
  message?: string;
}

export interface ICreateNotificationResponse {
  success: boolean;
  message: string;
  data: {
    MaTB: number;
    sentTo: string;
  };
}

// Lấy tất cả thông báo
export const getAllNotifications = async (): Promise<INotification[]> => {
  const res = await fetch(`http://localhost:5000/notifications`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Lỗi fetch notifications");
  }

  const response: INotificationResponse = await res.json();
  
  if (!response.success || !response.data) {
    throw new Error(response.message || "Không lấy được dữ liệu");
  }

  return response.data;
};

// Lấy thông báo theo tài khoản
export const getNotificationsByAccount = async (maTK: number): Promise<INotification[]> => {
  if (!maTK || maTK <= 0) {
    throw new Error("MaTK không hợp lệ");
  }

  const res = await fetch(`http://localhost:5000/notifications/account/${maTK}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Lỗi fetch notifications by account");
  }

  const response: INotificationResponse = await res.json();
  
  if (!response.success || !response.data) {
    throw new Error(response.message || "Không lấy được dữ liệu");
  }

  return response.data;
};

// Tạo và gửi thông báo
export const createAndSendNotification = async (
  NoiDung: string,
  MaTKList?: number[],
  Role?: number,
  senderMaTK?: number, // MaTK của người gửi (để loại bỏ khỏi danh sách người nhận)
  LoaiTB?: string // Loại thông báo
): Promise<ICreateNotificationResponse> => {
  if (!NoiDung || !NoiDung.trim()) {
    throw new Error("Nội dung thông báo không được để trống");
  }

  const body: any = { NoiDung: NoiDung.trim() };
  
  // Thêm LoaiTB nếu có
  if (LoaiTB) {
    body.LoaiTB = LoaiTB;
  }
  
  // Thêm senderMaTK nếu có
  if (senderMaTK) {
    body.senderMaTK = senderMaTK;
  }
  
  if (MaTKList && Array.isArray(MaTKList) && MaTKList.length > 0) {
    // Loại bỏ người gửi khỏi danh sách người nhận ở frontend
    body.MaTKList = senderMaTK 
      ? MaTKList.filter(id => id !== senderMaTK)
      : MaTKList;
  } else if (Role && [1, 2, 3].includes(Role)) {
    body.Role = Role;
  }

  const res = await fetch("http://localhost:5000/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Lỗi tạo thông báo");
  }

  const response: ICreateNotificationResponse = await res.json();
  
  if (!response.success) {
    throw new Error(response.message || "Tạo thông báo thất bại");
  }

  return response;
};

// Xóa thông báo
export const deleteNotification = async (id: number): Promise<void> => {
  if (!id || id <= 0) {
    throw new Error("ID không hợp lệ");
  }

  const res = await fetch(`http://localhost:5000/notifications/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Lỗi xóa thông báo");
  }

  const response = await res.json();
  
  if (!response.success) {
    throw new Error(response.message || "Xóa thông báo thất bại");
  }
};

