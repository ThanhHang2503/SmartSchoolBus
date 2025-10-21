"use client";

import { User } from '@/types/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaCalendar, FaUser, FaMap, FaBell, FaSignOutAlt, FaTasks } from 'react-icons/fa';

interface SidebarProps {
  user?: User | null;
  logout: () => void;
}

const Sidebar = ({ user, logout }: SidebarProps) => {
  const pathname = usePathname();

  if (!user) {
    console.log('Sidebar: No user, hiding Sidebar');
    return null;
  }

  const menuItemBaseClasses = 'bg-white bg-opacity-90 rounded-lg shadow-md hover:bg-blue-100 transition-all duration-200';
  const linkBaseClasses = 'flex items-center space-x-3 p-3 rounded-lg text-gray-800 font-medium';

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;
    return `${linkBaseClasses} ${isActive ? 'bg-blue-200 text-blue-800' : 'text-gray-800'}`;
  };

  return (
    <aside className="w-52 bg-[#87CEEB] h-screen p-4 flex flex-col shadow-2xl">
      <div className="flex-1 overflow-y-auto">
        {user.role === 'admin' && (
          <ul className="space-y-3">
            <li className={menuItemBaseClasses}>
              <Link href="/admin/overview" className={getLinkClasses('/admin/overview')}>
                <FaHome className="text-lg" />
                <span>Tổng quan</span>
              </Link>
            </li>
            <li className={menuItemBaseClasses}>
              <Link href="/admin/schedule" className={getLinkClasses('/admin/schedule')}>
                <FaCalendar className="text-lg" />
                <span>Lịch trình</span>
              </Link>
            </li>
            <li className={menuItemBaseClasses}>
              <Link href="/admin/assign" className={getLinkClasses('/admin/assign')}>
                <FaTasks className="text-lg" />
                <span>Phân công</span>
              </Link>
            </li>
            <li className={menuItemBaseClasses}>
              <Link href="/admin/notifications" className={getLinkClasses('/admin/notifications')}>
                <FaBell className="text-lg" />
                <span>Thông báo</span>
              </Link>
            </li>
          </ul>
        )}

        {user.role === 'driver' && (
          <ul className="space-y-3">
            <li className={menuItemBaseClasses}>
              <Link href="/driver/overview" className={getLinkClasses('/driver/overview')}>
                <FaHome className="text-lg" />
                <span>Tổng quan</span>
              </Link>
            </li>
            <li className={menuItemBaseClasses}>
              <Link href="/driver/map" className={getLinkClasses('/driver/map')}>
                <FaMap className="text-lg" />
                <span>Hành trình</span>
              </Link>
            </li>
            <li className={menuItemBaseClasses}>
              <Link href="/driver/schedule" className={getLinkClasses('/driver/schedule')}>
                <FaTasks className="text-lg" />
                <span>Lịch trình</span>
              </Link>
            </li>
           
          </ul>
        )}

        {user.role === 'parent' && (
          <ul className="space-y-3">
            <li className={menuItemBaseClasses}>
              <Link href="/parent/overview" className={getLinkClasses('/parent/overview')}>
                <FaHome className="text-lg" />
                <span>Tổng quan</span>
              </Link>
            </li>
            <li className={menuItemBaseClasses}>
              <Link href="/parent/tracking" className={getLinkClasses('/parent/tracking')}>
                <FaMap className="text-lg" />
                <span>Theo dõi</span>
              </Link>
            </li>
            <li className={menuItemBaseClasses}>
              <Link href="/parent/notification" className={getLinkClasses('/parent/notification')}>
                <FaBell className="text-lg" />
                <span>Thông báo</span>
              </Link>
            </li>
          </ul>
        )}
      </div>

      <div className="sticky bottom-0 bg-[#87CEEB] py-2">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 p-3 bg-red-500 hover:bg-red-600 rounded-lg shadow-lg transition-all duration-200 text-white font-semibold"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;