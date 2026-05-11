import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import SearchBar from "../components/common/SearchBar";
import EntriesSelector from "../components/common/EntriesSelector";
import Pagination from "../components/common/Paginations";
import ConfirmModal from "../components/common/ConfirmModal";
import { showToast } from "../components/common/Toast";
import {
  fetchAdminWFHRequests,
  updateWFHRequestStatus,
  setAdminWfhFilter,
  setAdminWfhPagination,
  clearAdminWfhError,
} from "../store/slices/wfhSlice";
import { FiEye, FiCheckCircle, FiXCircle, FiCalendar, FiUser, FiInfo, FiClock } from "react-icons/fi";
import StatusBadge from "../components/common/StatusBadge";

const AdminWFH = () => {
  const dispatch = useDispatch();
  const { requests, filter, pagination, loading, error } = useSelector(
    (state) => state.wfh
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    dispatch(fetchAdminWFHRequests({
      status: filter.status !== 'all' ? filter.status : undefined,
      search: filter.search || undefined,
      page: pagination.currentPage,
      limit: pagination.perPage
    }));
  }, [dispatch, filter.status, filter.search, pagination.currentPage, pagination.perPage]);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
      dispatch(clearAdminWfhError());
    }
  }, [error, dispatch]);

  const handleStatusFilter = (status) => {
    dispatch(setAdminWfhFilter({ status: status === "all" ? "all" : status.toLowerCase() }));
  };

  const handleSearch = (value) => {
    dispatch(setAdminWfhFilter({ search: value }));
  };

  const handlePageChange = (page) => {
    dispatch(setAdminWfhPagination({ currentPage: page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEntriesChange = (value) => {
    dispatch(setAdminWfhPagination({ currentPage: 1, perPage: value }));
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleApproveClick = (id) => {
    setSelectedRequestId(id);
    setActionType("approve");
    setConfirmOpen(true);
  };

  const handleRejectClick = (id) => {
    setSelectedRequestId(id);
    setActionType("reject");
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequestId) return;
    
    setActionLoading(true);
    // Many backends expect capitalized status values and a processed_by field
    const newStatus = actionType === "approve" ? "Approved" : "Rejected";
    
    const result = await dispatch(
      updateWFHRequestStatus({ 
        id: selectedRequestId, 
        status: newStatus,
        processedBy: "Admin"
      })
    );
    
    if (updateWFHRequestStatus.fulfilled.match(result)) {
      showToast(`WFH request ${newStatus} successfully`, "success");
      setConfirmOpen(false);
      setSelectedRequestId(null);
      setActionType(null);
      // Re-fetch to get updated list and counts
      dispatch(fetchAdminWFHRequests());
    } else {
      showToast(result.payload || `Failed to ${actionType} request`, "error");
    }
    
    setActionLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Client-side filtering and pagination logic
  const getFilteredRequests = () => {
    let filtered = [...requests];
    
    if (filter.status !== "all") {
      filtered = filtered.filter(
        (r) => r.status?.toLowerCase() === filter.status.toLowerCase()
      );
    }
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          (r.reason || "").toLowerCase().includes(searchLower) ||
          (r.employeeName || "").toLowerCase().includes(searchLower) ||
          (r.notes || "").toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  };

  const filteredRequests = getFilteredRequests();
  const totalPages = Math.ceil(filteredRequests.length / pagination.perPage);
  const start = (pagination.currentPage - 1) * pagination.perPage;
  const currentRequests = filteredRequests.slice(
    start,
    start + pagination.perPage
  );

  // Stats calculation
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status?.toLowerCase() === "pending").length,
    approved: requests.filter(r => r.status?.toLowerCase() === "approved").length,
    rejected: requests.filter(r => r.status?.toLowerCase() === "rejected").length,
  };

  return (
    <div className="app flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`flex-1 min-w-0 w-full overflow-x-hidden ${!isMobile ? "md:ml-[72px]" : ""}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content px-4 py-4 md:px-6 md:py-6 w-full overflow-x-hidden">
          
          {/* Stats Cards */}
          <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-center mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiCalendar className="text-blue-600 dark:text-blue-400 text-lg md:text-xl" />
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">Total</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.total}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">All Requests</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-center mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiClock className="text-amber-600 dark:text-amber-400 text-lg md:text-xl" />
                </div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">Pending</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.pending}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Pending Review</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-center mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiCheckCircle className="text-green-600 dark:text-green-400 text-lg md:text-xl" />
                </div>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Approved</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.approved}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Accepted</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-center mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiXCircle className="text-red-600 dark:text-red-400 text-lg md:text-xl" />
                </div>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">Rejected</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.rejected}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Declined</div>
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-600 dark:from-gray-100 dark:to-green-400 bg-clip-text text-transparent">
              Work From Home Requests
            </h2>
          </div>

          {/* Status Tabs */}
          <div className="overflow-x-auto pb-2 mb-6 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-2 min-w-max border-b border-gray-200 dark:border-gray-700 pb-4">
              {["all", "pending", "approved", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap capitalize ${
                    filter.status === status
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/30 transform scale-105"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-green-500/50 hover:text-green-500"
                  }`}
                >
                  {status === "all" ? "All Requests" : status}
                </button>
              ))}
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
            <EntriesSelector value={pagination.perPage} onChange={handleEntriesChange} />
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <SearchBar
                value={filter.search}
                onChange={handleSearch}
                placeholder="Search by employee, reason..."
              />
            </div>
          </div>

          {/* Table container */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sl.No.</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mb-3"></div>
                          <p className="text-gray-500 dark:text-gray-400 font-medium">Fetching requests...</p>
                        </div>
                      </td>
                    </tr>
                  ) : currentRequests.length > 0 ? (
                    currentRequests.map((request, idx) => (
                      <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {start + idx + 1}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium">
                          {formatDate(request.date)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-xs">
                              {request.employeeName.charAt(0)}
                            </div>
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{request.employeeName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate" title={request.reason}>
                          {request.reason}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={request.status} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shadow-sm"
                              title="View Details"
                            >
                              <FiEye className="text-base" />
                            </button>
                            {request.status?.toLowerCase() === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApproveClick(request.id)}
                                  className="p-2 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors shadow-sm"
                                  title="Approve"
                                >
                                  <FiCheckCircle className="text-base" />
                                </button>
                                <button
                                  onClick={() => handleRejectClick(request.id)}
                                  className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm"
                                  title="Reject"
                                >
                                  <FiXCircle className="text-base" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                            <FiCalendar className="text-gray-300 dark:text-gray-600 text-2xl" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">No requests found</h3>
                          <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">No Work From Home requests match your current filters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={pagination.total}
                itemsPerPage={pagination.perPage}
              />
            </div>
          )}
        </main>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1100] flex items-center justify-center p-4 transition-all animate-in fade-in duration-300" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white dark:bg-gray-800 max-w-md w-full rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 dark:border-gray-700 transform animate-in slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                  <FiInfo className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-outfit">WFH Details</h3>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center">
                <FiXCircle className="text-xl" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-green-500"><FiUser className="text-lg" /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Employee</p>
                  <p className="text-base font-semibold text-gray-800 dark:text-gray-200">{selectedRequest.employeeName}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-green-500"><FiCalendar className="text-lg" /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Requested Date</p>
                  <p className="text-base font-semibold text-gray-800 dark:text-gray-200">{formatDate(selectedRequest.date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-green-500"><FiInfo className="text-lg" /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Reason</p>
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{selectedRequest.reason}</p>
                </div>
              </div>

              {selectedRequest.notes && (
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-green-500"><FiInfo className="text-lg" /></div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Additional Notes</p>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed italic">"{selectedRequest.notes}"</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Current Status</span>
                <StatusBadge status={selectedRequest.status} />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              {selectedRequest.status?.toLowerCase() === "pending" && (
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleApproveClick(selectedRequest.id);
                    }}
                    className="py-3.5 rounded-2xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
                  >
                    <FiCheckCircle /> Approve
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleRejectClick(selectedRequest.id);
                    }}
                    className="py-3.5 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
                  >
                    <FiXCircle /> Reject
                  </button>
                </div>
              )}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setSelectedRequestId(null);
          setActionType(null);
        }}
        onConfirm={handleConfirmAction}
        title={actionType === "approve" ? "Approve WFH Request" : "Reject WFH Request"}
        message={actionType === "approve" 
          ? "Are you sure you want to approve this WFH request? The employee will be notified." 
          : "Are you sure you want to reject this WFH request? Please ensure you have a valid reason."}
        confirmText={actionType === "approve" ? "Approve" : "Reject"}
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminWFH;