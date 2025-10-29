"use client";

import Sidebar from "@/components/Sidebar";
import { User } from "@/types/auth";
import React from "react";

interface DriverLayoutProps {
  children: React.ReactNode;
  user?: User | null; // Tùy chọn, có thể null
}

const DriverLayout: React.FC<DriverLayoutProps> = ({ children, user }) => {
  const safeUser = user || null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Xóa hoặc comment dòng dưới để loại bỏ Header */}
      {/* <Header user={safeUser} role={safeUser?.role} /> */}
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar user={safeUser} logout={() => {}} />
        <main
          style={{ flex: 1, padding: "20px", backgroundColor: "#f3ececff" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DriverLayout;
