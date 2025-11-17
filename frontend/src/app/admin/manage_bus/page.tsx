'use client';

import { useState, useMemo } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const mockBuses = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  license: `59A-${String(i + 1).padStart(5, '0')}`,
  driver: `Tài xế ${String.fromCharCode(65 + (i % 10))}`,
  capacity: 45,
  status: i % 3 === 0 ? 'Hoạt động' : i % 3 === 1 ? 'Bảo trì' : 'Ngừng',
  route: `Tuyến ${i % 5 + 1}`,
}));

export default function ManageBusPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState<any>(null);
  const [formData, setFormData] = useState({
    license: '', driver: '', capacity: '', status: 'Hoạt động', route: ''
  });

  const itemsPerPage = 10;

  const filteredBuses = useMemo(() => {
    return mockBuses.filter(b =>
      b.license.includes(searchTerm) ||
      b.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.route.includes(searchTerm)
    );
  }, [searchTerm]);

  const paginatedBuses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBuses.slice(start, start + itemsPerPage);
  }, [filteredBuses, currentPage]);

  const totalPages = Math.ceil(filteredBuses.length / itemsPerPage);

  const openAddModal = () => {
    setFormData({ license: '', driver: '', capacity: '', status: 'Hoạt động', route: '' });
    setShowAddModal(true);
  };

  const openEditModal = (bus: any) => {
    setSelectedBus(bus);
    setFormData({ ...bus });
    setShowEditModal(true);
  };

  const openDeleteModal = (bus: any) => {
    setSelectedBus(bus);
    setShowDeleteModal(true);
  };

  const handleSave = () => {
    alert(showEditModal ? 'Cập nhật xe thành công!' : 'Thêm xe thành công!');
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const handleDelete = () => {
    alert(`Đã xóa xe: ${selectedBus.license}`);
    setShowDeleteModal(false);
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Quản lý xe buýt</h1>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo biển số, tài xế, tuyến..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FaPlus /> Thêm xe buýt
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Biển số', 'Tài xế', 'Sức chứa', 'Trạng thái', 'Tuyến', 'Hành động'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedBuses.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.license}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{b.driver}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{b.capacity} chỗ</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        b.status === 'Hoạt động' ? 'bg-green-100 text-green-800' :
                        b.status === 'Bảo trì' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>{b.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{b.route}</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <button onClick={() => openEditModal(b)} className="text-blue-600 hover:text-blue-900 mr-3"><FaEdit /></button>
                      <button onClick={() => openDeleteModal(b)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-3 flex items-center justify-between border-t">
              <div className="text-sm text-gray-700">
                Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, filteredBuses.length)} của {filteredBuses.length}
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
            <h3 className="text-lg font-semibold mb-4">{showEditModal ? 'Sửa' : 'Thêm'} xe buýt</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Biển số" value={formData.license} onChange={e => setFormData({ ...formData, license: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="text" placeholder="Tài xế" value={formData.driver} onChange={e => setFormData({ ...formData, driver: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="number" placeholder="Sức chứa" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Hoạt động</option>
                <option>Bảo trì</option>
                <option>Ngừng</option>
              </select>
              <input type="text" placeholder="Tuyến đường" value={formData.route} onChange={e => setFormData({ ...formData, route: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
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
            <p className="mb-6">Xóa xe <strong>{selectedBus?.license}</strong>?</p>
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