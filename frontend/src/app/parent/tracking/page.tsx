"use client";
import React from "react";
import MyMap from "@/components/Map";

const Tracking: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-sky-700">Theo dõi hành trình</h2>
      <div className="bg-sky-50 p-4 rounded-xl shadow-sm">
        <div style={{ height: 500 }} className="rounded-md overflow-hidden">
          <MyMap />
        </div>
      </div>
    </div>
  );
};

export default Tracking;
