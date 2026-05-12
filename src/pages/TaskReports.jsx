import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import SearchBar from "../components/common/SearchBar";
import EntriesSelector from "../components/common/EntriesSelector";
import Pagination from "../components/common/Paginations";
import { fetchTaskReports, deleteTaskReport } from "../store/slices/taskReportSlice";
import { showToast } from "../components/common/Toast";
import { fetchEmployees } from "../store/slices/employeeSlice";
import TaskReportModal from "../components/taskReports/TaskReportModal";
import ConfirmModal from "../components/common/ConfirmModal";

const TaskReports = () => {
  const dispatch = useDispatch();
  const { taskReports = [], loading, error } = useSelector((state) => state.taskReports || {});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    dispatch(fetchTaskReports());
    dispatch(fetchEmployees());
  }, [dispatch]);

  const getFilteredReports = () => {
    let filtered = taskReports;
    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.tasksCompleted
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          report.planForTomorrow
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          report.remarks.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return filtered;
  };

  const filteredReports = getFilteredReports();
  const totalFiltered = filteredReports.length;
  const totalPages = Math.ceil(totalFiltered / perPage);
  const start = (currentPage - 1) * perPage;
  const pageReports = filteredReports.slice(start, start + perPage);

  const handleView = (report) => {
    setSelectedReport(report);
    setViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setSelectedReport(null);
  };
  
  const handleAdd = () => {
    setEditingReport(null);
    setReportModalOpen(true);
  };
  
  const handleEdit = (report) => {
    setEditingReport(report);
    setReportModalOpen(true);
  };
  
  const handleDelete = (id) => {
    setReportToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!reportToDelete) return;
    
    setDeleteLoading(true);
    const result = await dispatch(deleteTaskReport(reportToDelete));
    setDeleteLoading(false);
    
    if (deleteTaskReport.fulfilled.match(result)) {
      showToast("Task report deleted successfully", "success");
      setDeleteModalOpen(false);
      setReportToDelete(null);
      // If we deleted from view modal, close it
      if (viewModalOpen) handleViewModalClose();
    } else {
      showToast("Failed to delete task report", "error");
    }
  };

  // Calculate stats
  const totalReports = taskReports.length;
  const uniqueEmployees = [...new Set(taskReports.map((r) => r.employee))]
    .length;
  const today = new Date().toISOString().split("T")[0];
  const todayReports = taskReports.filter((r) => r.date === today).length;

  return (
    <div className="app flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div
        className={`flex-1 min-w-0 w-full overflow-x-hidden ${!isMobile ? "md:ml-[72px]" : ""}`}
      >
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content px-4 py-4 md:px-6 md:py-6 w-full overflow-x-hidden">
          {/* Stats Cards */}
          <div className="stats-grid grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-5 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-2 md:mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-file-alt text-green-600 dark:text-green-400 text-base md:text-xl"></i>
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-green-600 dark:text-green-400">
                {totalReports}
              </div>
              <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                Total Reports
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-5 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-2 md:mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-users text-blue-600 dark:text-blue-400 text-base md:text-xl"></i>
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {uniqueEmployees}
              </div>
              <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                Employees Reported
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-5 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-2 md:mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-calendar-day text-amber-600 dark:text-amber-400 text-base md:text-xl"></i>
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {todayReports}
              </div>
              <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                Today's Reports
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-600 dark:from-gray-200 dark:to-green-400 bg-clip-text text-transparent">
              Task Reports
            </h2>
            <button 
              onClick={handleAdd}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              <i className="fas fa-plus-circle"></i> Add Task Report
            </button>
          </div>
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-5">
            <EntriesSelector value={perPage} onChange={setPerPage} />
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by employee, tasks..."
              />
            </div>
          </div>

          {loading && taskReports.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft mb-6">
              <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Loading task reports...</p>
            </div>
          )}

          {!loading && (error || taskReports.length === 0) && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center shadow-soft mb-6">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clipboard-list text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">No reports found</h3>
              <p className="text-gray-500 dark:text-gray-400">There are no task reports to display at this time.</p>
            </div>
          )}

          {/* Task Reports Table */}
          {taskReports.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto shadow-soft">
              <div className="min-w-[800px] md:min-w-0">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Sl.No.
                      </th>
                      <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Date
                      </th>
                      <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Employee
                      </th>
                      <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Tasks Completed
                      </th>
                      <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Plan for Tomorrow
                      </th>
                      <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Remarks
                      </th>
                      <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageReports.map((report, idx) => (
                      <tr
                        key={report.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          {start + idx + 1}
                        </td>
                        <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          {report.date}
                        </td>
                        <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {report.employee}
                        </td>
                        <td
                          className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate"
                          title={report.tasksCompleted}
                        >
                          {report.tasksCompleted.length > 40
                            ? report.tasksCompleted.substring(0, 40) + "..."
                            : report.tasksCompleted}
                        </td>
                        <td
                          className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate"
                          title={report.planForTomorrow}
                        >
                          {report.planForTomorrow.length > 40
                            ? report.planForTomorrow.substring(0, 40) + "..."
                            : report.planForTomorrow}
                        </td>
                        <td
                          className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 max-w-[150px] truncate"
                          title={report.remarks}
                        >
                          {report.remarks.length > 30
                            ? report.remarks.substring(0, 30) + "..."
                            : report.remarks || "-"}
                        </td>
                        <td className="px-3 md:px-4 py-2 md:py-3">
                          <div className="flex gap-1 md:gap-2">
                            <button
                              onClick={() => handleView(report)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500 transition-colors"
                              title="View"
                            >
                              <i className="fas fa-eye text-xs md:text-sm"></i>
                            </button>
                            <button
                              onClick={() => handleEdit(report)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-amber-500 transition-colors"
                              title="Edit"
                            >
                              <i className="fas fa-edit text-xs md:text-sm"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(report.id)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors"
                              title="Delete"
                            >
                              <i className="fas fa-trash text-xs md:text-sm"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalFiltered}
            itemsPerPage={perPage}
          />
        </main>
      </div>

      {/* View Task Report Modal */}
      {viewModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-soft-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <i className="fas fa-eye text-green-500"></i>
                Task Report Details
              </h3>
              <button
                onClick={handleViewModalClose}
                className="text-gray-400 hover:text-red-500 transition-colors text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Date
                  </label>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                    {selectedReport.date}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Employee
                  </label>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                    {selectedReport.employee}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Tasks Completed
                </label>
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedReport.tasksCompleted}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Plan for Tomorrow
                </label>
                <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedReport.planForTomorrow}
                  </p>
                </div>
              </div>

              {selectedReport.remarks && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Remarks
                  </label>
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedReport.remarks}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleViewModalClose}
                className="px-4 py-2 rounded-full font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleViewModalClose();
                  handleEdit(selectedReport);
                }}
                className="px-4 py-2 rounded-full font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-all flex items-center gap-2 text-sm"
              >
                <i className="fas fa-edit"></i> Edit
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add/Edit Task Report Modal */}
      <TaskReportModal 
        isOpen={reportModalOpen} 
        onClose={() => setReportModalOpen(false)} 
        editingReport={editingReport}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Task Report"
        message="Are you sure you want to delete this task report? This action cannot be undone."
        confirmText="Delete"
        loading={deleteLoading}
      />
    </div>
  );
};

export default TaskReports;
