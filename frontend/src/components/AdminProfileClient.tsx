"use client"

import { useEffect, useState } from "react"
import { Loader2, User, Phone, Mail, Shield } from "lucide-react"
import { type IAdminDetail, getAdminById } from "@/api/adminApi"

interface AdminDetailWithEmail extends IAdminDetail {
  TenDangNhap?: string
}

export default function AdminProfileClient() {
  const [admin, setAdmin] = useState<AdminDetailWithEmail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (!token || !userData) {
        setLoading(false)
        return
      }

      try {
        const user = JSON.parse(userData)
        const adminData = await getAdminById(token)
        if (adminData) setAdmin({ ...adminData, TenDangNhap: user.email })
      } catch (err) {
        console.error("Lỗi khi lấy thông tin admin:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-slate-600 dark:text-slate-400">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  if (!admin) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 mb-8">
          {/* Gradient Background */}
          <div className="h-2 bg-gradient-to-r from-blue-100 via-blue-500 to-indigo-600 relative">
            <div className="absolute inset-0 opacity-10 bg-pattern"></div>
          </div>

          {/* Profile Info Section */}
          <div className="px-8">
            {/* Avatar and Name */}
            <div className="flex items-end gap-6 mb-8">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl flex items-center justify-center border-4 border-white dark:border-slate-900 flex-shrink-0">
                <User className="w-16 h-16 text-white" />
              </div>
              <div className="pb-2 pt-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{admin.HoTen}</h1>
                <p className="text-base text-slate-500 dark:text-slate-400 font-medium">Quản trị viên hệ thống</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Phone */}
              <div className="group p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Số điện thoại
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-2 break-all">
                      {admin.SoDienThoai || "Không có thông tin"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="group p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex-shrink-0">
                    <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-2 break-all">
                      {admin.TenDangNhap || "Không có thông tin"}
                    </p>
                  </div>
                </div>
              </div>

              

              {/* Status */}
              <div className="group p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all md:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 flex-shrink-0">
                    <div className={`w-5 h-5 rounded-full ${admin.TrangThai === 1 ? "bg-green-500" : "bg-red-500"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Trạng thái
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`w-3 h-3 rounded-full ${admin.TrangThai === 1 ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {admin.TrangThai === 1 ? "Hoạt động" : "Không hoạt động"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}</p>
        </div>
      </div>
    </div>
  )
}
