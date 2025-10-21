// src/components/Header.tsx
import React from 'react';
import { User } from '@/types/auth';
import { styled } from '@mui/material/styles';

// ĐỊNH NGHĨA MÀU CHUNG
const HEADER_BACKGROUND_COLOR = '#d4e8ff';

const StyledHeader = styled('div')(({ theme }) => ({
  width: '100%',
  // Cập nhật màu nền của Header
  backgroundColor: HEADER_BACKGROUND_COLOR, 
  padding: theme.spacing(1, 2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
  height: '100px',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  transition: 'height 0.3s ease, padding 0.3s ease',
  
  [theme.breakpoints.down('lg')]: {
    height: '95px',
    padding: theme.spacing(0.875, 1.75),
  },
  [theme.breakpoints.down('md')]: {
    height: '90px',
    padding: theme.spacing(0.75, 1.5),
  },
  [theme.breakpoints.down('sm')]: {
    height: '80px',
    padding: theme.spacing(0.5, 1),
  },
  [theme.breakpoints.down('xs')]: {
    height: '70px',
    padding: theme.spacing(0.25, 0.5),
  },
}));

const Logo = styled('img')(({ theme }) => ({
  width: '100px',
  height: '80px',
  // Xóa đổ bóng
  boxShadow: 'none',
  // Đặt màu nền của Logo trùng với Header để hòa vào
  backgroundColor: HEADER_BACKGROUND_COLOR, 
  
  transition: 'width 0.3s ease, height 0.3s ease',
  // ... (các breakpoint khác không thay đổi)
  [theme.breakpoints.down('lg')]: {
    width: '95px',
    height: '75px',
  },
  [theme.breakpoints.down('md')]: {
    width: '90px',
    height: '70px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '80px',
    height: '60px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '60px',
    height: '50px',
  },
}));

const Title = styled('h1')(({ theme }) => ({
  color: '#2d4f7f', 
  margin: 0,
  fontSize: '28px',
  flexGrow: 1,
  textAlign: 'center',
  transition: 'font-size 0.3s ease',

  [theme.breakpoints.down('lg')]: {
    fontSize: '26px',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '24px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '20px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px',
  },
}));

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const role = user?.role ? user.role : '';

  if (!user) return null;

  return (
    <StyledHeader>
      <Logo src="/image/ssb.png" alt="Logo" />
      <Title>Smart School Bus SSB 1.0</Title>
    </StyledHeader>
  );
};

export default Header;