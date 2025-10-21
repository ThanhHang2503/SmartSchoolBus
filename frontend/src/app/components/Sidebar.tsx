"use client";
import React from "react";
import { Home, MapPin, Bell, Phone, LogOut } from "lucide-react";

interface SidebarProps {
  activePage: string;
  onSelect: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onSelect }) => {
  return (
    <div className="w-56 h-screen bg-sky-200 flex flex-col p-3 gap-3">
      {/* Header */}
      <div className="flex flex-col items-center justify-center h-24 bg-sky-100 rounded-xl">
        <p className="font-bold text-sky-800 text-center text-lg">Phụ huynh</p>
      </div>

      {/* Menu buttons */}
      <button
        onClick={() => onSelect("overview")}
        className={`flex items-center gap-2 p-3 rounded-lg font-medium transition-colors duration-200 ${
          activePage === "overview"
            ? "bg-sky-500 text-white shadow-md"
            : "text-slate-800 hover:bg-sky-300 hover:text-sky-800"
        }`}
      >
        <Home size={18} /> Tổng quan
      </button>

      <button
        onClick={() => onSelect("tracking")}
        className={`flex items-center gap-2 p-3 rounded-lg font-medium transition-colors duration-200 ${
          activePage === "tracking"
            ? "bg-sky-500 text-white shadow-md"
            : "text-slate-800 hover:bg-sky-300 hover:text-sky-800"
        }`}
      >
        <MapPin size={18} /> Theo dõi
      </button>

      <button
        onClick={() => onSelect("notification")}
        className={`flex items-center gap-2 p-3 rounded-lg font-medium transition-colors duration-200 ${
          activePage === "notification"
            ? "bg-sky-500 text-white shadow-md"
            : "text-slate-800 hover:bg-sky-300 hover:text-sky-800"
        }`}
      >
        <Bell size={18} /> Thông báo
      </button>

      <button
        onClick={() => onSelect("contact")}
        className={`flex items-center gap-2 p-3 rounded-lg font-medium transition-colors duration-200 ${
          activePage === "contact"
            ? "bg-sky-500 text-white shadow-md"
            : "text-slate-800 hover:bg-sky-300 hover:text-sky-800"
        }`}
      >
        <Phone size={18} /> Liên hệ
      </button>

      {/* Logout */}
      <div className="flex-grow" />
      <button className="flex items-center gap-2 p-3 rounded-lg text-red-600 hover:bg-red-100 font-semibold">
        <LogOut size={18} /> Đăng xuất
      </button>
    </div>
  );
};

export default Sidebar;
