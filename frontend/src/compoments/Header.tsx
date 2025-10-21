import React from 'react';

interface HeaderProps {
  role?: string; 
}

const Header: React.FC<HeaderProps> = ({ role }) => {
  return (
    <div style={{ backgroundColor: '#87CEEB', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '10px 10px 0 0', height: '100px' }}>
      <img src="/image/logo.png" alt="Logo" style={{ width: '100px', height: '80px',  boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.3)' }} />
      <h1 style={{ color: 'black', margin: 0, fontSize: '28px', flexGrow: 1, textAlign: 'center' }}>Smart School Bus SSB 1.0</h1>
      {role && <span style={{ color: '#333', fontSize: '16px' }}> Vai trò: {role}</span>}
    </div>
  );
};

export default Header;