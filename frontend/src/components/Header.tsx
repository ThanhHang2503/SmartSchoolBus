// src/components/Header.tsx
'use client';

import React from 'react';
import { User } from '@/types/auth';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

// ĐỊNH NGHĨA MÀU CHUNG
const HEADER_BACKGROUND_COLOR = '#d4e8ff';

const StyledHeader = styled('div')(({ theme }) => ({
  width: '100%',
  backgroundColor: HEADER_BACKGROUND_COLOR,
  padding: theme.spacing(1, 2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start', // Logo bên trái
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

const LogoLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(3),
  flexShrink: 0,
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.03)',
  },
  [theme.breakpoints.down('sm')]: {
    marginRight: theme.spacing(2),
  },
}));

const Logo = styled('img')(({ theme }) => ({
  width: '100px',
  height: '80px',
  backgroundColor: HEADER_BACKGROUND_COLOR,
  transition: 'width 0.3s ease, height 0.3s ease',

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

const TitleWrapper = styled('div')({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  pointerEvents: 'none', // Chặn click vào vùng chữ
});

const Title = styled('h1')(({ theme }) => ({
  color: '#2d4f7f',
  margin: 0,
  fontSize: '28px',
  fontWeight: 600,
  whiteSpace: 'nowrap',
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
  const { t } = useTranslation('common');
  
  if (!user) return null;

  return (
    <StyledHeader>
    
      <LogoLink href="/home" passHref>
        <Logo src="/image/ssb.png" alt="Logo" />
      </LogoLink>

      
      <TitleWrapper>
        <Title>{t('header.title')}</Title>
      </TitleWrapper>
    </StyledHeader>
  );
};

export default Header;