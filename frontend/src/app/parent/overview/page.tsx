"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";


const Overview: React.FC = () => {
  const { user } = useAuth();
  const [parent, setParent] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        // Giả sử user.id là MaTK
        const res = await fetch(`http://localhost:5000/parent/account/${user.id}`);
        if (!res.ok) throw new Error("Không lấy được dữ liệu phụ huynh");
        const data = await res.json();
        setParent(data.parent);
        setStudents(data.students);
      } catch (err) {
        setParent(null);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!parent) return <div>Không tìm thấy thông tin phụ huynh.</div>;

  return (
    <div className="text-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-sky-700">Tổng quan</h2>
      <div className="bg-sky-50 p-4 rounded-xl shadow-sm mb-4">
        <p><strong>Phụ huynh:</strong> {parent.HoTen}</p>
        <p><strong>Số điện thoại:</strong> {parent.SoDienThoai}</p>
        <p><strong>Tài khoản:</strong> {parent.TenDangNhap}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-2">Danh sách học sinh</h3>
        {students.length === 0 ? (
          <p>Không có học sinh nào.</p>
        ) : (
          <ul className="space-y-2">
            {students.map((hs) => (
              <li key={hs.MaHS} className="border-b pb-2">
                <p><strong>Học sinh:</strong> {hs.HoTen}</p>
                <p><strong>Lớp:</strong> {hs.Lop}</p>
                <p><strong>Ngày sinh:</strong> {hs.NgaySinh}</p>
                <p><strong>Trạm đón:</strong> {hs.TenTramDon}</p>
                <p><strong>Trạm trả:</strong> {hs.TenTramTra}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Overview;
