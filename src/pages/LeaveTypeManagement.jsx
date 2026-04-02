import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import EntriesSelector from '../components/common/EntriesSelector';
import Loader from '../components/common/Loader';
import LeaveTypeModal from '../components/leaves/LeaveTypeModal';
import { showToast } from '../components/common/Toast';
import { fetchLeaveTypes, deleteLeaveType } from '../store/slices/leaveSlice';
import Pagination from '../components/common/Paginations';

const LeaveTypeManagement = () => {
  const dispatch = useDispatch();
  const { leaveTypes, loading } = useSelector((state) => state.leaves);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null);

  useEffect(() => {
    dispatch(fetchLeaveTypes());
  }, [dispatch]);

  const getFilteredTypes = () => {
    let filtered = leaveTypes;
    if (searchTerm) {
      filtered = filtered.filter(type =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredTypes = getFilteredTypes();
  const totalFiltered = filteredTypes.length;
  const totalPages = Math.ceil(totalFiltered / perPage);
  const start = (currentPage - 1) * perPage;
  const pageTypes = filteredTypes.slice(start, start + perPage);

  const handleAdd = () => {
    setEditingType(null);
    setShowModal(true);
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      const result = await dispatch(deleteLeaveType(id));
      if (deleteLeaveType.fulfilled.match(result)) {
        showToast(`${name} removed`, 'success');
      } else {
        showToast('Failed to delete leave type', 'error');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingType(null);
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-[72px] md:ml-[72px]">
        <Header />
        <main className="p-4 md:p-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link to="/leaves" className="text-green-500 hover:text-green-600 font-medium">Leaves</Link>
            <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
            <span className="text-gray-500 dark:text-gray-400">Leave Type Management</span>
          </div>

          {/* Header */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-600 dark:from-gray-200 dark:to-green-400 bg-clip-text text-transparent">
              Leave Types List
            </h2>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
            <EntriesSelector value={perPage} onChange={setPerPage} />
            <div className="flex gap-3">
              <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search records..." />
              <button
                onClick={handleAdd}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <i className="fas fa-plus-circle"></i> Add New Type
              </button>
            </div>
          </div>

          {/* Leave Types Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto shadow-soft">
            <table className="w-full border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Sl.No.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageTypes.map((type, idx) => (
                  <tr key={type.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-center">{start + idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">{type.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(type)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-amber-500 transition-colors"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(type.id, type.name)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors"
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageTypes.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No leave types found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalFiltered}
            itemsPerPage={perPage}
          />
        </main>
      </div>

      {/* Add/Edit Leave Type Modal */}
      <LeaveTypeModal
        isOpen={showModal}
        editingType={editingType}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default LeaveTypeManagement;