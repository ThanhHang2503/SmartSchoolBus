"use client";
import React, { useEffect, useState } from "react";
import { getAllAdmins, IAdminDetail } from "@/api/adminApi";
import { Loader2, User, Phone } from "lucide-react";

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState<IAdminDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setLoading(true);
        const admins = await getAllAdmins();
        if (!admins || admins.length === 0) {
          throw new Error("Không tìm thấy thông tin admin");
        }
        setAdmin(admins[0]);
      } catch (err) {
        setError("Không thể tải dữ liệu admin");
        console.error("Error fetching admin:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center pt-20 bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-gray-700 text-lg">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error || !admin) {
    return (
      <div className="min-h-screen flex justify-center pt-20 bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-lg">{error || "Không có dữ liệu"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center pt-20 bg-gray-100 p-5">
      <div className="w-full max-w-lg">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{admin.HoTen}</h2>
              <p className="text-gray-600 text-base mt-1">ID: {admin.id}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Phone */}
            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-base text-gray-600">Số điện thoại</p>
                <p className="text-xl font-semibold text-gray-900">{admin.SoDienThoai}</p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-4">
              <div
                className={`w-5 h-5 rounded-full ${
                  admin.TrangThai === 1 ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <div>
                <p className="text-base text-gray-600">Trạng thái</p>
                <p className="text-xl font-semibold text-gray-900">
                  {admin.TrangThai === 1 ? "Hoạt động" : "Không hoạt động"}
                </p>
              </div>
            </div>

            {/* Username */}
            <div className="flex items-center gap-4">
              <User className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-base text-gray-600">Tên đăng nhập</p>
                <p className="text-xl font-semibold text-gray-900">{admin.TenDangNhap}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
