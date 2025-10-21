
"use client";

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { styled } from '@mui/material/styles';

const StyledLayout = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
});

const MainContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    height: 'auto',
  },
}));

const Main = styled('main')(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  overflowY: 'auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
  [theme.breakpoints.down('xs')]: {
    padding: theme.spacing(0.5),
  },
}));

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) console.log('Layout: User:', user, 'Role:', user?.role, 'Pathname:', pathname);
    if (!user && pathname !== '/') {
      if (isDev) console.log('Layout: Redirecting to / due to no user');
      router.push('/');
    }
  }, [user, pathname, router]);

  if (pathname === '/') {
    return <>{children}</>;
  }

  return (
    <StyledLayout>
      <Header user={user} />
      <MainContent>
        <Sidebar user={user} logout={logout} />
        <Main>{children}</Main>
      </MainContent>
    </StyledLayout>
  );
}
