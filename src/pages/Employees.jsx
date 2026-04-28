import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import SearchBar from "../components/common/SearchBar";
import EntriesSelector from "../components/common/EntriesSelector";
import { showToast } from "../components/common/Toast";
import {
  fetchEmployees,
  setCurrentPage,
  setPerPage,
  setFilters,
  deleteEmployee,
} from "../store/slices/employeeSlice";
import Pagination from "../components/common/Paginations";
import ConfirmModal from "../components/common/ConfirmModal";

const Employees = () => {
  const dispatch = useDispatch();
  const { employees, currentPage, perPage, filters } = useSelector(
    (state) => state.employees,
  );
  const [statusFilter, setStatusFilter] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Confirm modal states
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch, currentPage, perPage, filters, statusFilter]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    dispatch(setFilters({ search: value }));
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    dispatch(setFilters({ status }));
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;
    
    setDeleteLoading(true);
    const result = await dispatch(deleteEmployee(selectedEmployee.id));
    
    if (deleteEmployee.fulfilled.match(result)) {
      showToast(`${selectedEmployee.name} deleted successfully`, "success");
      setConfirmOpen(false);
      setSelectedEmployee(null);
      // Refresh the list
      dispatch(fetchEmployees());
    } else {
      showToast("Failed to delete employee", "error");
    }
    
    setDeleteLoading(false);
  };

  const getFilteredEmployees = () => {
    let filtered = employees;
    if (statusFilter !== "all") {
      filtered = filtered.filter((emp) => emp.status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.designation.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return filtered;
  };

  const filteredEmployees = getFilteredEmployees();
  const totalFiltered = filteredEmployees.length;
  const totalPages = Math.ceil(totalFiltered / perPage);
  const start = (currentPage - 1) * perPage;
  const pageEmployees = filteredEmployees.slice(start, start + perPage);

  const getStorageUrl = (path) => {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "";
    return `${baseUrl}/storage/${String(path).replace(/^\/+/, "")}`;
  };

  const getEmployeeAvatarUrl = (emp) => {
    const raw = emp?.raw || {};
    const possible =
      raw?.passport_size_photo ||
      raw?.user?.passport_size_photo ||
      raw?.user?.avatar ||
      raw?.user?.profile_picture ||
      raw?.user?.profile_photo ||
      raw?.photo ||
      raw?.image;

    return getStorageUrl(possible);
  };

  return (
    <div className="app flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div
        className={`flex-1 min-w-0 w-full overflow-x-hidden ${!isMobile ? (sidebarOpen ? "md:ml-[250px]" : "md:ml-[84px]") : ""}`}
      >
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content px-4 py-4 md:px-6 md:py-6 w-full overflow-x-hidden">
          {/* Page title + breadcrumb */}
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-slate-100">
              Employees
            </h2>
            <div className="mt-1 text-xs text-slate-400">
              Employees <span className="px-1">{">"}</span> Listing
            </div>
          </div>

          {/* Listing header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-soft">
            <div className="flex flex-col gap-3 p-4 md:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Employees ({statusFilter})
                </div>
                <Link
                  to="/employees/add-employee"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
                >
                  <i className="fas fa-plus"></i> Add Employee
                </Link>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusFilter("Active")}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    statusFilter === "Active"
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => handleStatusFilter("Inactive")}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    statusFilter === "Inactive"
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Inactive
                </button>
              </div>

              {/* Actions row */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <EntriesSelector
                  value={perPage}
                  onChange={(val) => dispatch(setPerPage(val))}
                />
                <SearchBar
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search records..."
                />
              </div>
            </div>
          </div>

          {/* Employees Table - Horizontal Scroll on Mobile */}
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto shadow-soft">
            <div className="min-w-[800px] md:min-w-0">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">
                      S.L.NO.
                    </th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">
                      NAME
                    </th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">
                      DESIGNATION
                    </th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">
                      DEPARTMENT
                    </th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">
                      COMPANY
                    </th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageEmployees.map((emp, idx) => (
                    <tr
                      key={emp.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center">
                        {start + idx + 1}
                      </td>
                      <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200">
                        <div className="flex items-center gap-3">
                          {getEmployeeAvatarUrl(emp) ? (
                            <img
                              src={getEmployeeAvatarUrl(emp)}
                              alt={emp.name}
                              className="h-9 w-9 rounded-full object-cover border border-slate-200"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                              {(emp.name || "?").trim().charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="truncate">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        {emp.designation}
                      </td>
                      <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        {emp.department}
                      </td>
                      <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        {emp.raw?.user?.company?.company_name || emp.company || '-'}
                      </td>
                      <td className="px-3 md:px-4 py-2 md:py-3">
                        <div className="flex gap-1 md:gap-2">
                          <Link
                            to={`/employees/${emp.id}`}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-blue-500 transition-colors"
                            title="View Details"
                          >
                            <i className="fas fa-eye text-xs md:text-sm"></i>
                          </Link>
                          <Link
                            to={`/employees/edit/${emp.id}`}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-amber-500 transition-colors"
                            title="Edit"
                          >
                            <i className="fas fa-edit text-xs md:text-sm"></i>
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(emp)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors"
                            title="Delete"
                          >
                            <i className="fas fa-trash text-xs md:text-sm"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pageEmployees.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        No employees found
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
            onPageChange={(page) => dispatch(setCurrentPage(page))}
            totalItems={totalFiltered}
            itemsPerPage={perPage}
          />
        </main>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setSelectedEmployee(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete "${selectedEmployee?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleteLoading}
      />
    </div>
  );
};

export default Employees;