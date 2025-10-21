'use client';
import React from 'react';
import Sidebar from './sidebar';
import Header from '@/compoments/Header';

const DriverLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header role="Tài xế" />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '20px', backgroundColor: '#f3ececff' }}>
          {children}
        </main>

      </div>
    </div>
  );
};

export default DriverLayout;