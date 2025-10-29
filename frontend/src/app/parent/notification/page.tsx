import React from "react";

const notifications = [
  { id: 1, message: "Xe buýt sắp đến điểm đón trong 5 phút", time: "07:00" },
  { id: 2, message: "Học sinh Nguyễn Minh An đã lên xe", time: "07:05" },
  { id: 3, message: "Xe buýt đã đến trường", time: "07:30" },
];

const Notification: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-sky-700">Thông báo</h2>
      <ul className="space-y-3">
        {notifications.map((n) => (
          <li
            key={n.id}
            className="bg-sky-50 p-4 rounded-xl shadow-sm hover:bg-sky-100 transition"
          >
            <p className="text-black">{n.message}</p>
            <p className="text-sm text-gray-500 mt-1">{n.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
