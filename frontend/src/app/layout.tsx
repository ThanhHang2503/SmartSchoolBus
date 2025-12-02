// app/layout.tsx
'use client';

import Layout from '@/components/Layout';
import { AuthProvider } from '@/context/AuthContext';
import LanguageSync from '@/components/LanguageSync';
import '@/i18n'; // Khởi tạo i18n
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <LanguageSync />
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}