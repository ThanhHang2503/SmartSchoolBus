"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";


const Overview: React.FC = () => {
  const { t } = useTranslation('common');
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
        if (!res.ok) throw new Error(t('parent.cannotLoadParentData'));
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

  if (loading) return <div>{t('parent.loadingData')}</div>;
  if (!parent) return <div>{t('parent.parentNotFound')}</div>;

  return (
    <div className="text-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-sky-700">{t('parent.overview')}</h2>
      <div className="bg-sky-50 p-4 rounded-xl shadow-sm mb-4">
        <p><strong>{t('parent.parent')}:</strong> {parent.HoTen}</p>
        <p><strong>{t('common.phone')}:</strong> {parent.SoDienThoai}</p>
        <p><strong>{t('parent.account')}:</strong> {parent.TenDangNhap}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-2">{t('parent.studentList')}</h3>
        {students.length === 0 ? (
          <p>{t('parent.noStudents')}</p>
        ) : (
          <ul className="space-y-2">
            {students.map((hs) => (
              <li key={hs.MaHS} className="border-b pb-2">
                <p><strong>{t('parent.student')}:</strong> {hs.HoTen}</p>
                <p><strong>{t('parent.class')}:</strong> {hs.Lop}</p>
                <p><strong>{t('parent.birthday')}:</strong> {hs.NgaySinh}</p>
                <p><strong>{t('parent.pickupStation')}:</strong> {hs.TenTramDon}</p>
                <p><strong>{t('parent.dropoffStation')}:</strong> {hs.TenTramTra}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Overview;
