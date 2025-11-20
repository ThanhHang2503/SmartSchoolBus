// src/components/Layout.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Box } from '@mui/material';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isInitialized } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (isInitialized && !user && pathname !== '/') {
      router.push('/');
    }
  }, [user, pathname, router, isInitialized]);

  // Chưa load xong → loading (suppress hydration warning)
  if (!isInitialized) {
    return (
      <div suppressHydrationWarning style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  // Trang login → không có Layout
  if (pathname === '/' || !user) {
    return <>{children}</>;
  }

  // ĐÃ ĐĂNG NHẬP → Layout chuẩn
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Header trên cùng
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#f5faff',
      }}
    >
      {/* HEADER – TOÀN CHIỀU RỘNG, CỐ ĐỊNH TRÊN CÙNG */}
      <Header user={user} />

      {/* NỘI DUNG CHÍNH: Sidebar + Main */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* SIDEBAR – BÊN TRÁI, CAO BẰNG NỘI DUNG */}
        <Sidebar user={user} logout={logout} />

        {/* MAIN CONTENT – SLIDER NẰM ĐÂY */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: 'auto',           // Cho phép cuộn ở mọi trang
            position: 'relative',
            backgroundColor: '#fff',
            p: { xs: 1, sm: 2 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}