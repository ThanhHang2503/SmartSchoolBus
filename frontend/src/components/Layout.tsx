'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Redirect nếu không có user và không ở trang đăng nhập
  useEffect(() => {
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) console.log('Layout: User:', user, 'Role:', user?.role, 'Pathname:', pathname);
    if (!user && pathname !== '/') {
      if (isDev) console.log('Layout: Redirecting to / due to no user');
      router.push('/');
    }
  }, [user, pathname, router]);

  // Không render Header và Sidebar cho trang đăng nhập
  if (pathname === '/') {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header user={user} />

      {/* Nội dung chính: Sidebar và Main */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} logout={logout} />
        <main className="flex-1 p-5 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}