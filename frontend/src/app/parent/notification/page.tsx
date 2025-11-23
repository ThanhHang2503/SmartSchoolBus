"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Notification: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return setLoading(false);
      try {
        const res = await fetch(`http://localhost:5000/parent/notifications/${user.id}`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Lỗi khi lấy thông báo:", err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  if (loading) return <div>Đang tải thông báo...</div>;
  if (!user) return <div>Vui lòng đăng nhập để xem thông báo.</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-sky-700">Thông báo</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">Chưa có thông báo.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n: any) => (
            <li
              key={n.MaTB}
              className="bg-sky-50 p-4 rounded-xl shadow-sm hover:bg-sky-100 transition"
            >
              <p className="text-black">{n.NoiDung}</p>
              <p className="text-sm text-gray-500 mt-1">{new Date(n.ThoiGian).toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Loại: {n.LoaiTB}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
