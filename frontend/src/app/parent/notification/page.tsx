"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

const Notification: React.FC = () => {
  const { t } = useTranslation('common');
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

  if (loading) return <div>{t('parent.loadingNotifications')}</div>;
  if (!user) return <div>{t('parent.pleaseLogin')}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-sky-700">{t('parent.notifications')}</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">{t('parent.noNotifications')}</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n: any) => (
            <li
              key={n.MaTB}
              className="bg-sky-50 p-4 rounded-xl shadow-sm hover:bg-sky-100 transition"
            >
              <div className="flex justify-between items-start mb-2">
                {n.LoaiTB && (
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      n.LoaiTB === "Xe trễ" || n.LoaiTB === t('parent.lateBus')
                        ? "bg-yellow-100 text-yellow-800"
                        : n.LoaiTB === "Sự cố" || n.LoaiTB === t('parent.incident')
                        ? "bg-red-100 text-red-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {n.LoaiTB}
                  </span>
                )}
                <p className="text-sm text-gray-500">
                  {n.ThoiGian ? new Date(n.ThoiGian).toLocaleString('vi-VN') : 
                   n.NgayTao && n.GioTao ? `${n.NgayTao} ${n.GioTao}` : t('parent.noTime')}
                </p>
              </div>
              <p className="text-black">{n.NoiDung}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
