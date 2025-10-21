"use client";
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Overview from "./pages/Overview";
import Tracking from "./pages/Tracking";
import Notification from "./pages/Notification";
import Contact from "./pages/Contact";

export default function Page() {
  const [activePage, setActivePage] = useState("overview");

  const renderPage = () => {
    switch (activePage) {
      case "tracking":
        return <Tracking />;
      case "notification":
        return <Notification />;
      case "contact":
        return <Contact />;
      default:
        return <Overview />;
    }
  };

  const getTitle = () => {
    switch (activePage) {
      case "tracking":
        return "Theo dõi hành trình";
      case "notification":
        return "Thông báo";
      case "contact":
        return "Liên hệ";
      default:
        return "Tổng quan";
    }
  };

  return (
    <div className="flex h-screen bg-sky-50">
      <Sidebar activePage={activePage} onSelect={setActivePage} />
      <div className="flex-1 p-6">
        <Header title={getTitle()} />
        <div className="bg-white rounded-2xl shadow-md h-[90%] p-6 overflow-y-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
