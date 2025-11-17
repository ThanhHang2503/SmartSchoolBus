'use client';

import { useState, useMemo } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

// === DỮ LIỆU GIẢ LẬP ===
const mockStudents = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  code: `HS${String(i + 1).padStart(4, '0')}`,
  name: `Nguyễn Văn ${String.fromCharCode(65 + (i % 26))}`,
  class: `${Math.floor(i / 10) + 1}${String.fromCharCode(65 + (i % 10))}`,
  pickup: `Điểm ${i % 5 + 1}`,
  dropoff: `Trường THCS ${i % 3 === 0 ? 'A' : i % 3 === 1 ? 'B' : 'C'}`,
  phone: `090${Math.floor(Math.random() * 9000000) + 1000000}`,
}));

export default function ManagePage() {
  // === STATE ===
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '', name: '', class: '', pickup: '', dropoff: '', phone: ''
  });

  const itemsPerPage = 10;

  // === TÌM KIẾM & LỌC ===
  const filteredStudents = useMemo(() => {
    return mockStudents.filter(s =>
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.class.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // === PHÂN TRANG ===
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // === MODAL HANDLERS ===
  const openAddModal = () => {
    setFormData({ code: '', name: '', class: '', pickup: '', dropoff: '', phone: '' });
    setShowAddModal(true);
  };

  const openEditModal = (student: any) => {
    setSelectedStudent(student);
    setFormData({ ...student });
    setShowEditModal(true);
  };

  const openDeleteModal = (student: any) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  const handleSave = () => {
    alert(showEditModal ? 'Cập nhật thành công!' : 'Thêm học sinh thành công!');
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const handleDelete = () => {
    alert(`Đã xóa học sinh: ${selectedStudent.name}`);
    setShowDeleteModal(false);
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* TIÊU ĐỀ */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Quản lý học sinh</h1>

        {/* TÌM KIẾM + NÚT THÊM */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo mã, tên, lớp..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus /> Thêm học sinh
          </button>
        </div>

        {/* BẢNG DỮ LIỆU */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Mã HS', 'Họ tên', 'Lớp', 'Điểm đón', 'Điểm trả', 'SĐT PH', 'Hành động'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedStudents.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.class}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.pickup}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.dropoff}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEditModal(s)} className="text-blue-600 hover:text-blue-900 mr-3">
                        <FaEdit />
                      </button>
                      <button onClick={() => openDeleteModal(s)} className="text-red-600 hover:text-red-900">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PHÂN TRANG */}
          {totalPages > 1 && (
            <div className="bg-white px-6 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredStudents.length)} của {filteredStudents.length} kết quả
              </div>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === MODAL THÊM / SỬA === */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {showEditModal ? 'Sửa học sinh' : 'Thêm học sinh mới'}
            </h3>
            <div className="space-y-4">
              {[
                { key: 'code', label: 'Mã học sinh' },
                { key: 'name', label: 'Họ tên' },
                { key: 'class', label: 'Lớp' },
                { key: 'pickup', label: 'Điểm đón' },
                { key: 'dropoff', label: 'Điểm trả' },
                { key: 'phone', label: 'SĐT phụ huynh' },
              ].map(({ key, label }) => (
                <input
                  key={key}
                  type="text"
                  placeholder={label}
                  value={formData[key as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {showEditModal ? 'Cập nhật' : 'Thêm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL XÓA === */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
            <p className="text-gray-700 mb-6">
              Bạn có chắc muốn xóa học sinh <strong>{selectedStudent?.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}