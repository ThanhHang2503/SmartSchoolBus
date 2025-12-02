"use client";

import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import type React from "react";
import { useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const { t } = useTranslation('common');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);

    await login(email, password);

    // Nếu đăng nhập thành công (AuthContext sẽ lưu user), ta hiển thị check icon
    const userData = localStorage.getItem("user");
    if (userData) {
      setIsSuccess(true);
      // Đợi 3s để hiển thị icon trước khi chuyển trang (tránh bị mất đột ngột)
      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);
    }
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundImage: `url(/image/background.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Language Switcher - Góc trên bên phải */}
      <LanguageSwitcher />

      {/* Form Container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative bg-white/25 backdrop-blur-sm p-8 rounded-2xl shadow-lg pointer-events-auto w-[360px] text-center">
          <h1 className="text-4xl font-bold text-[#2d4f7f] mb-8">
            {t('loginTitle')}
          </h1>

          {/* Nếu đăng nhập thành công thì hiển thị icon ✅ */}
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="#FCFCFC"
                className="w-20 h-20 animate-[pop_0.3s_ease-in-out]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <p className="mt-4 font-semibold text-lg text-[#FCFCFC]">
                {t('loginSuccess')}
              </p>
            </div>
          ) : (
            // Form đăng nhập
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  placeholder={t('account')}
                  className="w-full px-4 py-3 rounded-lg bg-white text-[#2d4f7f] placeholder-[#9dc4d8] border-2 border-[#b8d4e8] focus:outline-none focus:border-[#7eb3d4] transition-colors"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.trim())}
                  placeholder={t('password')}
                  className="w-full px-4 py-3 rounded-lg bg-white text-[#2d4f7f] placeholder-[#9dc4d8] border-2 border-[#b8d4e8] focus:outline-none focus:border-[#7eb3d4] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-[#7eb3d4] hover:bg-[#6a9fc0] text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('loggingIn') : t('submitLogin')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}