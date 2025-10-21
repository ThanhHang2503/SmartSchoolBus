"use client";

import React from "react";
import { Bell, User } from "lucide-react";

interface HeaderProps {
  title?: string;
  user?: { name?: string; role?: string } | null; // Thêm prop user
  onNotificationClick?: () => void; // Thêm sự kiện cho thông báo
}

const Header: React.FC<HeaderProps> = ({ title, user, onNotificationClick }) => {
  const displayName = user?.name || "Khách";
  const displayRole = user?.role || "Chưa đăng nhập";

  return (
    <div className="flex justify-between items-center bg-sky-100 rounded-xl p-4 shadow-md mb-4">
      <h1 className="text-2xl font-bold text-sky-700">
        {title || "Smart School Bus SSB 1.0"}
      </h1>

      <div className="flex items-center gap-4">
        <button
          className="relative hover:text-sky-600 transition-colors"
          onClick={onNotificationClick} // Thêm sự kiện click
        >
          <Bell size={24} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2">
          <User size={26} className="text-sky-700" />
          <span className="font-medium text-gray-700">
            {displayName} ({displayRole})
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;