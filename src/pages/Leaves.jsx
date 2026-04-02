import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import EntriesSelector from '../components/common/EntriesSelector';
import Loader from '../components/common/Loader';
import LeaveModal from '../components/leaves/LeaveModal';
import { showToast } from '../components/common/Toast';
import { fetchLeaves, updateLeaveStatus } from '../store/slices/leaveSlice';
import Pagination from '../components/common/Paginations';

const Leaves = () => {
  const dispatch = useDispatch();
  const { leaves, loading } = useSelector((state) => state.leaves);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchLeaves());
  }, [dispatch]);

  const getFilteredLeaves = () => {
    let filtered = leaves;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(leave => leave.status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(leave =>
        leave.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredLeaves = getFilteredLeaves();
  const totalFiltered = filteredLeaves.length;
  const totalPages = Math.ceil(totalFiltered / perPage);
  const start = (currentPage - 1) * perPage;
  const pageLeaves = filteredLeaves.slice(start, start + perPage);

  const handleApprove = async (id) => {
    const result = await dispatch(updateLeaveStatus({ id, status: 'Approved', processedBy: 'HR Admin' }));
    if (updateLeaveStatus.fulfilled.match(result)) {
      showToast('Leave request approved', 'success');
    }
  };

  const handleReject = async (id) => {
    const result = await dispatch(updateLeaveStatus({ id, status: 'Rejected', processedBy: 'HR Admin' }));
    if (updateLeaveStatus.fulfilled.match(result)) {
      showToast('Leave request rejected', 'success');
    }
  };

  const handleView = (leave) => {
    setSelectedLeave(leave);
    setShowModal(true);
  };

  const handleViewDocument = (docName) => {
    alert(`📄 Document: ${docName}\n\n(File viewer would open here in production)`);
  };

  // Calculate stats
  const total = leaves.length;
  const pending = leaves.filter(l => l.status === 'Pending').length;
  const approved = leaves.filter(l => l.status === 'Approved').length;
  const rejected = leaves.filter(l => l.status === 'Rejected').length;

  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Approved': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'Rejected': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-[72px] md:ml-[72px]">
        <Header />
        <main className="p-4 md:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-calendar-alt text-green-600 dark:text-green-400 text-lg"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{total}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Requests</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-clock text-amber-600 dark:text-amber-400 text-lg"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pending}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Pending</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-check-circle text-green-600 dark:text-green-400 text-lg"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{approved}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Approved</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-times-circle text-red-600 dark:text-red-400 text-lg"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{rejected}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rejected</div>
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-600 dark:from-gray-200 dark:to-green-400 bg-clip-text text-transparent">
              Leave Requests
            </h2>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 mb-5 border-b border-gray-200 dark:border-gray-700 pb-3">
            {['all', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {status === 'all' ? 'All Requests' : status}
              </button>
            ))}
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
            <EntriesSelector value={perPage} onChange={setPerPage} />
            <div className="flex gap-3">
              <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by employee..." />
              <Link
                to="/leaves/leave-types"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <i className="fas fa-briefcase"></i> Manage leave types
              </Link>
            </div>
          </div>

          {/* Leave Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto shadow-soft">
            <table className="w-full border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Sl.No.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">From</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">To</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Days</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Claim Salary</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Doc</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Processed By</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageLeaves.map((leave, idx) => (
                  <tr key={leave.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-center">{start + idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">{leave.employee}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{leave.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{leave.fromDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{leave.toDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{leave.days}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        leave.claimSalary === 'Yes' 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {leave.claimSalary}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {leave.doc !== '-' ? (
                        <button
                          onClick={() => handleViewDocument(leave.doc)}
                          className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
                        >
                          <i className="fas fa-file-pdf"></i> {leave.doc}
                        </button>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-[150px] truncate" title={leave.reason}>
                      {leave.reason.length > 30 ? leave.reason.substring(0, 30) + '...' : leave.reason}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{leave.processedBy}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(leave)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500 transition-colors"
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        {leave.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(leave.id)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-green-500 transition-colors"
                              title="Approve"
                            >
                              <i className="fas fa-check-circle"></i>
                            </button>
                            <button
                              onClick={() => handleReject(leave.id)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors"
                              title="Reject"
                            >
                              <i className="fas fa-times-circle"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {pageLeaves.length === 0 && (
                  <tr>
                    <td colSpan="12" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No leave requests found
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

      {/* Leave Details Modal */}
      <LeaveModal
        isOpen={showModal}
        leave={selectedLeave}
        onClose={() => setShowModal(false)}
        onViewDocument={handleViewDocument}
      />
    </div>
  );
};

export default Leaves;