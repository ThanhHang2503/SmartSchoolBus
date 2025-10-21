'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) console.log('HomePage: User:', user, 'Role:', user?.role);
    if (!isLoading && !user) {
      if (isDev) console.log('HomePage: Redirecting to / due to no user');
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!user) {
    return null; // Không render nếu chưa đăng nhập (đã redirect trong useEffect)
  }

  return (
    <div>
      <h1>Trang chính</h1>
      <p>Chào mừng, {user.name}!</p>
      <p>Vai trò: {user.role}</p>
    </div>
  );
}