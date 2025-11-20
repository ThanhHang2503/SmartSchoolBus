// app/layout.tsx
import Layout from '@/components/Layout';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NotificationProvider>
            <Layout>{children}</Layout>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}