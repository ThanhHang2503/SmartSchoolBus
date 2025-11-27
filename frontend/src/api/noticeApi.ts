// frontend/api/noticeApi.ts

export interface INotice {
  MaTB: number;
  NoiDung: string;
  NgayTao: string;
  GioTao: string;
  ThoiGian: string; // thời gian gán cho người nhận
}

// Lấy tất cả thông báo (cho admin)
export const getAllNotices = async (): Promise<INotice[]> => {
  const res = await fetch(`http://localhost:5000/notice`);
  if (!res.ok) throw new Error("Lỗi fetch all notices");

  const data = await res.json();

  // Đảm bảo format đúng
  return data.map((n: any) => ({
    MaTB: n.MaTB,
    NoiDung: n.NoiDung,
    NgayTao: n.NgayTao || "",
    GioTao: n.GioTao || "",
    ThoiGian: n.ThoiGianGanNhat ? new Date(n.ThoiGianGanNhat).toISOString() : 
              (n.NgayTao && n.GioTao ? `${n.NgayTao} ${n.GioTao}` : ""),
  }));
};

// Lấy thông báo của 1 tài khoản
export const getNoticesByUser = async (MaTK: number): Promise<INotice[]> => {
  const res = await fetch(`http://localhost:5000/notice/${MaTK}`);
  if (!res.ok) throw new Error("Lỗi fetch notices");

  const data = await res.json();

  // Đảm bảo ThoiGian là string
  return data.map((n: any) => ({
    ...n,
    ThoiGian: n.ThoiGian ? new Date(n.ThoiGian).toISOString() : 
              (n.NgayTao && n.GioTao ? `${n.NgayTao} ${n.GioTao}` : ""),
  }));
};

// Gửi thông báo mới
export const sendNotice = async (content: string, receivers: number[], senderMaTK?: number) => {
  if (!content.trim()) throw new Error("Nội dung trống");
  if (!receivers || receivers.length === 0) throw new Error("Chưa chọn người nhận");

  // Lấy token từ localStorage
  const token = localStorage.getItem('token');
  
  const body: any = { content, receivers };
  if (senderMaTK) {
    body.senderMaTK = senderMaTK;
  }

  const headers: any = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch("http://localhost:5000/notice", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Lỗi gửi thông báo");
  }

  const data = await res.json();

  // Trả về array thông báo giống INotice
  return data.map((n: any) => ({
    MaTB: n.MaTB,
    NoiDung: n.NoiDung,
    NgayTao: n.NgayTao || "",
    GioTao: n.GioTao || "",
    ThoiGian: n.ThoiGian ? new Date(n.ThoiGian).toISOString() : "",
  }));
};
