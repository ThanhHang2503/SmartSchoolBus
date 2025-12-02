"use client";

// src/components/Sidebar.tsx
import React from 'react';
import { User } from '@/types/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaCalendar, FaUser, FaMap, FaBell, FaSignOutAlt, FaTasks, FaMapMarkerAlt } from 'react-icons/fa';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

// MÀU NỀN CHUNG: Dùng màu header mới
const BACKGROUND_COLOR = '#d4e8ff';
// MÀU CHỮ/ICON CHÍNH: Màu xanh đậm hơn để có độ tương phản tốt trên nền sáng
const PRIMARY_TEXT_COLOR = '#1e3a8a'; 
// MÀU NỀN ACTIVE: Một màu xanh nhạt hơn, nổi bật hơn so với nền sidebar
const ACTIVE_BACKGROUND_COLOR = '#b8d4e8'; 

const StyledSidebar = styled('aside')(({ theme }) => ({
  width: '250px',
  backgroundColor: BACKGROUND_COLOR, 
  height: 'calc(100vh - 100px)',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)', 
  transition: 'width 0.3s ease',
  [theme.breakpoints.down('lg')]: {
    width: '220px',
    padding: theme.spacing(1.75),
  },
  [theme.breakpoints.down('md')]: {
    width: '200px',
    padding: theme.spacing(1.5),
  },
  [theme.breakpoints.down('sm')]: {
    width: '150px',
    padding: theme.spacing(1),
  },
  [theme.breakpoints.down('xs')]: {
    width: '60px',
    padding: theme.spacing(0.5),
  },
}));

const MenuList = styled('ul')({
  flex: 1,
  overflowY: 'auto',
  listStyle: 'none',
  padding: 0,
});

const MenuItem = styled('li')(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: '#e6f0fa', 
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(0.5),
  },
  [theme.breakpoints.down('xs')]: {
    marginBottom: theme.spacing(0.5),
    textAlign: 'center',
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  color: PRIMARY_TEXT_COLOR,
  textDecoration: 'none',
  fontSize: '1rem',
  '&.active': {
    backgroundColor: ACTIVE_BACKGROUND_COLOR, 
    color: PRIMARY_TEXT_COLOR,
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
    padding: theme.spacing(0.5),
    gap: theme.spacing(0.5),
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: 0,
    padding: theme.spacing(0.5),
    justifyContent: 'center',
    '& span': {
      display: 'none',
    },
  },
}));

const LogoutButton = styled('button')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: '#ef4444', 
  color: '#ffffff',
  border: 'none',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#dc2626',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5),
gap: theme.spacing(0.5),
  },
  [theme.breakpoints.down('xs')]: {
    padding: theme.spacing(0.5),
    justifyContent: 'center',
    '& span': {
      display: 'none',
    },
  },
}));

interface SidebarProps {
  user?: User | null;
  logout: () => void;
}

const Sidebar = ({ user, logout }: SidebarProps) => {
  const pathname = usePathname();
  const { t } = useTranslation('common');

  if (!user) {
    console.log('Sidebar: No user, hiding Sidebar');
    return null;
  }

  const getLinkClasses = (href: string) => {
    return pathname === href ? 'active' : '';
  };

  return (
    <StyledSidebar>
      <MenuList>
        {user.role === 'admin' && (
          <>
            <MenuItem>
              <StyledLink href="/admin/overview" className={getLinkClasses('/admin/overview')}>
                <FaHome />
                <span>{t('sidebar.overview')}</span>
              </StyledLink>
            </MenuItem>
            <MenuItem>
              <StyledLink href="/admin/info_admin" className={getLinkClasses('/admin/info_admin')}>
                <FaCalendar />
                <span>{t('sidebar.infoManagement')}</span>
              </StyledLink>
            </MenuItem>
            <MenuItem>
              <StyledLink href="/admin/list" className={getLinkClasses('/admin/list')}>
                <FaUser/>
                <span>{t('sidebar.viewList')}</span>
              </StyledLink>
            </MenuItem>
            <MenuItem>
              <StyledLink href="/admin/schedule" className={getLinkClasses('/admin/schedule')}>
                <FaCalendar />
                <span>{t('sidebar.scheduleAssignment')}</span>
              </StyledLink>
            </MenuItem>
            <MenuItem>
              <StyledLink href="/admin/notify" className={getLinkClasses('/admin/follow-and-notify')}>
                <FaBell />
                <span>{t('sidebar.notification')}</span>
              </StyledLink>
            </MenuItem>
            <MenuItem>
              <StyledLink href="/admin/map" className={getLinkClasses('/admin/map')}>
                <FaMap />
                <span>{t('sidebar.route')}</span>
              </StyledLink>
            </MenuItem>          </>
        )}

        {user.role === 'driver' && (
          <>
            <MenuItem>
              <StyledLink href="/driver/overview" className={getLinkClasses('/driver/overview')}>
                <FaHome />
                <span>{t('sidebar.overview')}</span>
              </StyledLink>
            </MenuItem>
            <MenuItem>
              <StyledLink href="/driver/map" className={getLinkClasses('/driver/map')}>
                <FaMap />
                <span>{t('sidebar.route')}</span>
              </StyledLink>
            </MenuItem>
            <MenuItem>
              <StyledLink href="/driver/schedule" className={getLinkClasses('/driver/schedule')}>
                <FaTasks />
                <span>{t('sidebar.schedule')}</span>
              </StyledLink>
            </MenuItem>
          </>
        )}

        {user.role === 'parent' && (
          <>
            <MenuItem>
<StyledLink href="/parent/overview" className={getLinkClasses('/parent/overview')}>
                <FaHome />
                <span>{t('sidebar.overview')}</span>
              </StyledLink>
            </MenuItem>
            <MenuItem>
              <StyledLink href="/parent/tracking" className={getLinkClasses('/parent/tracking')}>
                <FaMap />
                <span>{t('sidebar.tracking')}</span>
              </StyledLink>
            </MenuItem>
            <MenuItem>
              <StyledLink href="/parent/notification" className={getLinkClasses('/parent/notifications')}>
                <FaBell />
                <span>{t('sidebar.notification')}</span>
              </StyledLink>
            </MenuItem>
          </>
        )}
      </MenuList>
      <LogoutButton onClick={logout}>
        <FaSignOutAlt />
        <span>{t('sidebar.logout')}</span>
      </LogoutButton>
    </StyledSidebar>
  );
};

export default Sidebar;