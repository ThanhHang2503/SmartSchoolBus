'use client';

import { useState, useMemo } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const mockDrivers = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Tài xế ${String.fromCharCode(65 + (i % 10))} ${i + 1}`,
  phone: `098${Math.floor(Math.random() * 9000000) + 1000000}`,
  license: `B2-${String(i + 1).padStart(5, '0')}`,
  bus: i % 3 === 0 ? '59A-00001' : i % 3 === 1 ? '59A-00002' : 'Chưa phân công',
  status: i % 4 === 0 ? 'Nghỉ' : 'Đang lái',
}));

export default function ManageDriverPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '', phone: '', license: '', bus: '', status: 'Đang lái'
  });

  const itemsPerPage = 10;

  const filteredDrivers = useMemo(() => {
    return mockDrivers.filter(d =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone.includes(searchTerm) ||
      d.license.includes(searchTerm)
    );
  }, [searchTerm]);

  const paginatedDrivers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDrivers.slice(start, start + itemsPerPage);
  }, [filteredDrivers, currentPage]);

  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);

  const openAddModal = () => {
    setFormData({ name: '', phone: '', license: '', bus: '', status: 'Đang lái' });
    setShowAddModal(true);
  };

  const openEditModal = (driver: any) => {
    setSelectedDriver(driver);
    setFormData({ ...driver });
    setShowEditModal(true);
  };

  const openDeleteModal = (driver: any) => {
    setSelectedDriver(driver);
    setShowDeleteModal(true);
  };

  const handleSave = () => {
    alert(showEditModal ? 'Cập nhật tài xế thành công!' : 'Thêm tài xế thành công!');
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const handleDelete = () => {
    alert(`Đã xóa tài xế: ${selectedDriver.name}`);
    setShowDeleteModal(false);
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Quản lý tài xế</h1>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, bằng lái..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FaPlus /> Thêm tài xế
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Họ tên', 'SĐT', 'Bằng lái', 'Xe đang lái', 'Trạng thái', 'Hành động'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedDrivers.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{d.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{d.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{d.license}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{d.bus}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${d.status === 'Đang lái' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <button onClick={() => openEditModal(d)} className="text-blue-600 hover:text-blue-900 mr-3"><FaEdit /></button>
                      <button onClick={() => openDeleteModal(d)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-3 flex items-center justify-between border-t">
              <div className="text-sm text-gray-700">
                Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredDrivers.length)} của {filteredDrivers.length}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded text-sm ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{showEditModal ? 'Sửa' : 'Thêm'} tài xế</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Họ tên" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="text" placeholder="Số điện thoại" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="text" placeholder="Bằng lái" value={formData.license} onChange={e => setFormData({ ...formData, license: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="text" placeholder="Xe đang lái" value={formData.bus} onChange={e => setFormData({ ...formData, bus: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Đang lái</option>
                <option>Nghỉ</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Hủy</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{showEditModal ? 'Cập nhật' : 'Thêm'}</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
            <p className="mb-6">Xóa tài xế <strong>{selectedDriver?.name}</strong>?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Hủy</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}