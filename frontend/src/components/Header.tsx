// src/components/Header.tsx
import React from 'react';
import { User } from '@/types/auth';

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const role = user?.role ? user.role : '';

  if (!user) return null; // Không render nếu chưa đăng nhập

  return (
    <div style={{ backgroundColor: '#87CEEB', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '10px 10px 0 0', height: '100px', position: 'sticky', top: 0, zIndex: 1000 }}>
      <img src="/image/logo.png" alt="Logo" style={{ width: '100px', height: '80px', boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.3)' }} />
      <h1 style={{ color: 'black', margin: 0, fontSize: '28px', flexGrow: 1, textAlign: 'center' }}>Smart School Bus SSB 1.0</h1>
    
    </div>
  );
};

export default Header;