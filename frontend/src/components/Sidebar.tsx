


"use client";

// src/components/Sidebar.tsx
import React from 'react';
import { User } from '@/types/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaCalendar, FaUser, FaMap, FaBell, FaSignOutAlt, FaTasks } from 'react-icons/fa';
import { styled } from '@mui/material/styles';

// MÀU NỀN CHUNG: Dùng màu header mới
const BACKGROUND_COLOR = '#d4e8ff';
// MÀU CHỮ/ICON CHÍNH: Màu xanh đậm hơn để có độ tương phản tốt trên nền sáng
const PRIMARY_TEXT_COLOR = '#1e3a8a'; 
// MÀU NỀN ACTIVE: Một màu xanh nhạt hơn, nổi bật hơn so với nền sidebar
const ACTIVE_BACKGROUND_COLOR = '#b8d4e8'; 

const StyledSidebar = styled('aside')(({ theme }) => ({
  width: '250px',
  // Cập nhật màu nền Sidebar
  backgroundColor: BACKGROUND_COLOR, 
  height: 'calc(100vh - 100px)',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  // Giữ bóng đổ để phân biệt với phần nội dung chính
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
    width: '60px', // Only icons on extra small screens
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
  // Giữ màu nền trắng hoặc gần trắng cho item menu để nổi bật trên nền sáng
  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  marginBottom: theme.spacing(1),
  // Điều chỉnh màu hover để có độ tương phản tốt hơn
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
  color: PRIMARY_TEXT_COLOR, // Màu chữ/icon đậm hơn
  textDecoration: 'none',
  fontSize: '1rem',
  '&.active': {
    // Màu nền khi active
    backgroundColor: ACTIVE_BACKGROUND_COLOR, 
    color: PRIMARY_TEXT_COLOR, // Giữ màu chữ đậm
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.9rem',
    padding: theme.spacing(0.5),
    gap: theme.spacing(0.5),
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: 0, // Hide text on xs
    padding: theme.spacing(0.5),
    justifyContent: 'center',
    '& span': {
      display: 'none', // Hide span text
    },
  },
}));

const LogoutButton = styled('button')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  // Giữ màu đỏ cho nút Logout
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
      display: 'none', // Hide text on xs
    },
  },
}));

interface SidebarProps {
  user?: User | null;
  logout: () => void;
}

const Sidebar = ({ user, logout }: SidebarProps) => {
  const pathname = usePathname();

  if (!user) {
    console.log('Sidebar: No user, hiding Sidebar');
    return null;
  }

  const getLinkClasses = (href: string) => {
    return `${pathname === href ? 'active' : ''}`;
  };

  return (
    <StyledSidebar>
      <MenuList>
        {user.role === 'admin' && (
          <>
            {/* Các MenuItem cho Admin */}
            <MenuItem>
              <StyledLink href="/admin/overview" className={getLinkClasses('/admin/overview')}>
                <FaHome />
                <span>Tổng quan</span>
              </StyledLink>
            </MenuItem>
            <MenuItem>
              <StyledLink href="/admin/schedule" className={getLinkClasses('/admin/schedule')}>
                <FaCalendar />
                <span>Lịch trình</span>
              </StyledLink>
            </MenuItem>
            <MenuItem>
              <StyledLink href="/admin/assign" className={getLinkClasses('/admin/assign')}>
                <FaTasks />
                <span>Phân công</span>
              </StyledLink>
            </MenuItem>
            <MenuItem>
              <StyledLink href="/admin/notifications" className={getLinkClasses('/admin/notifications')}>
                <FaBell />
                <span>Thông báo</span>
              </StyledLink>
            </MenuItem>
          </>
        )}

        {user.role === 'driver' && (
          <>
            {/* Các MenuItem cho Driver */}
            <MenuItem>
              <StyledLink href="/driver/overview" className={getLinkClasses('/driver/overview')}>
                <FaHome />
                <span>Tổng quan</span>
              </StyledLink>
            </MenuItem>
            <MenuItem>
              <StyledLink href="/driver/map" className={getLinkClasses('/driver/map')}>
                <FaMap />
                <span>Hành trình</span>
              </StyledLink>
            </MenuItem>
            <MenuItem>
              <StyledLink href="/driver/schedule" className={getLinkClasses('/driver/schedule')}>
                <FaTasks />
                <span>Lịch trình</span>
              </StyledLink>
            </MenuItem>
          </>
        )}

        {user.role === 'parent' && (
          <>
            {/* Các MenuItem cho Parent */}
            <MenuItem>
              <StyledLink href="/parent/overview" className={getLinkClasses('/parent/overview')}>
                <FaHome />
                <span>Tổng quan</span>
              </StyledLink>
            </MenuItem>
            <MenuItem>
              <StyledLink href="/parent/tracking" className={getLinkClasses('/parent/tracking')}>
                <FaMap />
                <span>Theo dõi</span>
              </StyledLink>
            </MenuItem>
            <MenuItem>
              <StyledLink href="/parent/notifications" className={getLinkClasses('/parent/notifications')}>
                <FaBell />
                <span>Thông báo</span>
              </StyledLink>
            </MenuItem>
          </>
        )}
      </MenuList>
      <LogoutButton onClick={logout}>
        <FaSignOutAlt />
        <span>Đăng xuất</span>
      </LogoutButton>
    </StyledSidebar>
  );
};

export default Sidebar;