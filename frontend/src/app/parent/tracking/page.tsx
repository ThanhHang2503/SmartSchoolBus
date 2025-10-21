import React from "react";

const Tracking: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-sky-700">Theo dõi hành trình</h2>
      <div className="bg-sky-50 p-4 rounded-xl shadow-sm text-center">
        <p className="text-black">🗺️ Bản đồ đang được tải...</p>
        <p className="mt-2 text-gray-500">
          Hiển thị vị trí xe buýt theo thời gian thực (demo placeholder)
        </p>
      </div>
    </div>
  );
};

export default Tracking;
