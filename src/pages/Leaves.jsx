import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import EntriesSelector from '../components/common/EntriesSelector';
import LeaveModal from '../components/leaves/LeaveModal';
import { showToast } from '../components/common/Toast';
import { fetchLeaves, updateLeaveStatus } from '../store/slices/leaveSlice';
import Pagination from '../components/common/Paginations';

const Leaves = () => {
  const dispatch = useDispatch();
  const { leaves } = useSelector((state) => state.leaves);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  return (
    <div className="app flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`flex-1 min-w-0 w-full overflow-x-hidden ${!isMobile ? 'md:ml-[72px]' : ''}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content px-4 py-4 md:px-6 md:py-6 w-full overflow-x-hidden">
          
          {/* Stats Cards - Responsive Grid */}
          <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            {/* Total Requests Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-1 md:mb-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-calendar-alt text-green-600 dark:text-green-400 text-sm md:text-lg"></i>
                </div>
              </div>
              <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">{total}</div>
              <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">Total Requests</div>
            </div>

            {/* Pending Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-1 md:mb-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-clock text-amber-600 dark:text-amber-400 text-sm md:text-lg"></i>
                </div>
              </div>
              <div className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400">{pending}</div>
              <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">Pending</div>
            </div>

            {/* Approved Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-1 md:mb-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-check-circle text-green-600 dark:text-green-400 text-sm md:text-lg"></i>
                </div>
              </div>
              <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">{approved}</div>
              <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">Approved</div>
            </div>

            {/* Rejected Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-1 md:mb-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-times-circle text-red-600 dark:text-red-400 text-sm md:text-lg"></i>
                </div>
              </div>
              <div className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400">{rejected}</div>
              <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium">Rejected</div>
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-600 dark:from-gray-200 dark:to-green-400 bg-clip-text text-transparent">
              Leave Requests
            </h2>
          </div>

          {/* Status Tabs - Horizontal Scroll on Mobile */}
          <div className="overflow-x-auto pb-2 mb-4 md:mb-5 -mx-4 px-4">
            <div className="flex gap-2 min-w-max border-b border-gray-200 dark:border-gray-700 pb-3">
              {['all', 'Pending', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    statusFilter === status
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {status === 'all' ? 'All Requests' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Actions Bar - Fully Responsive */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-5">
            <EntriesSelector value={perPage} onChange={setPerPage} />
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by employee..." />
              <Link
                to="/leaves/leave-types"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                <i className="fas fa-briefcase"></i>
                <span className="hidden sm:inline">Manage leave types</span>
                <span className="sm:hidden">Leave Types</span>
              </Link>
            </div>
          </div>

          {/* Leave Table - Horizontal Scroll on Mobile */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto shadow-soft">
            <div className="min-w-[1000px] lg:min-w-0">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">Sl.No.</th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">Employee</th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">Type</th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">From</th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">To</th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">Days</th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">Claim Salary</th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">Doc</th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">Reason</th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">Processed By</th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageLeaves.map((leave, idx) => (
                    <tr key={leave.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center">{start + idx + 1}</td>
                      <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">{leave.employee}</td>
                      <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{leave.type}</td>
                      <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{leave.fromDate}</td>
                      <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{leave.toDate}</td>
                      <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center">{leave.days}</td>
                      <td className="px-3 md:px-4 py-2 md:py-3">
                        <span className={`inline-block px-1.5 md:px-2 py-0.5 rounded-full text-[9px] md:text-xs font-semibold whitespace-nowrap ${
                          leave.claimSalary === 'Yes' 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {leave.claimSalary}
                        </span>
                       </td>
                      <td className="px-3 md:px-4 py-2 md:py-3">
                        {leave.doc !== '-' ? (
                          <button
                            onClick={() => handleViewDocument(leave.doc)}
                            className="text-blue-500 hover:text-blue-600 text-xs md:text-sm flex items-center gap-1"
                          >
                            <i className="fas fa-file-pdf text-xs md:text-sm"></i>
                            <span className="hidden sm:inline">{leave.doc}</span>
                          </button>
                        ) : '-'}
                       </td>
                      <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 max-w-[120px] md:max-w-[150px] truncate" title={leave.reason}>
                        {leave.reason}
                        </td>
                      <td className="px-3 md:px-4 py-2 md:py-3">
                        <span className={`inline-block px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs font-semibold whitespace-nowrap ${getStatusClass(leave.status)}`}>
                          {leave.status}
                        </span>
                        </td>
                      <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{leave.processedBy}</td>
                      <td className="px-3 md:px-4 py-2 md:py-3">
                        <div className="flex gap-1 md:gap-2">
                          <button
                            onClick={() => handleView(leave)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500 transition-colors"
                            title="View Details"
                          >
                            <i className="fas fa-eye text-xs md:text-sm"></i>
                          </button>
                          {leave.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(leave.id)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-green-500 transition-colors"
                                title="Approve"
                              >
                                <i className="fas fa-check-circle text-xs md:text-sm"></i>
                              </button>
                              <button
                                onClick={() => handleReject(leave.id)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors"
                                title="Reject"
                              >
                                <i className="fas fa-times-circle text-xs md:text-sm"></i>
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