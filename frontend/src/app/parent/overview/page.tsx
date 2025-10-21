import React from "react";

const Overview: React.FC = () => {
  return (
    <div className="text-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-sky-700">Tổng quan</h2>
      <div className="bg-sky-50 p-4 rounded-xl shadow-sm">
        <p><strong>Học sinh:</strong> Nguyễn Minh An</p>
        <p><strong>Lớp:</strong> 3A</p>
        <p><strong>Tình trạng:</strong> 🚍 Đang trên xe</p>
        <p><strong>Tuyến đường:</strong> Tuyến 05 - Khu đô thị Phú Mỹ Hưng</p>
        <p><strong>Thời gian đến trường dự kiến:</strong> 07:30</p>
      </div>
    </div>
  );
};

export default Overview;
