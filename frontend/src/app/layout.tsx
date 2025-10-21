import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/app/styles/theme'; // Confirm this path matches your structure

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <Layout>{children}</Layout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}