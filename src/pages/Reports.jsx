import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import { showToast } from "../components/common/Toast";
import { fetchEmployees } from "../store/slices/employeeSlice";
import { fetchOrganizations } from "../store/slices/organizationSlice";
import { fetchAttendanceRecords } from "../store/slices/attendanceSlice";
import { fetchLeaves } from "../store/slices/leaveSlice";

const Reports = () => {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const { organizations = [] } = useSelector((state) => state.organizations || {});
  const { employees = [] } = useSelector((state) => state.employees || {});
  const { records: attendanceRecords = [] } = useSelector((state) => state.attendance || {});
  const { leaves: leaveRecords = [] } = useSelector((state) => state.leaves || {});
  
  const [currentTab, setCurrentTab] = useState("attendance");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Filter states
  const [selectedCompany, setSelectedCompany] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [dateRange, setDateRange] = useState("thisMonth");
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  // Export states
  const [exportReportType, setExportReportType] = useState("attendance");
  const [exportDateRange, setExportDateRange] = useState("thisMonth");
  const [exportFormat, setExportFormat] = useState("csv");
  const [exportCustomFrom, setExportCustomFrom] = useState("");
  const [exportCustomTo, setExportCustomTo] = useState("");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    dispatch(fetchOrganizations());
    dispatch(fetchEmployees());
    dispatch(fetchAttendanceRecords());
    dispatch(fetchLeaves());
  }, [dispatch]);

  // Set default date range
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    setDefaultDateRange();
  }, [dateRange]);

  // Filter employees based on selected company and department
  useEffect(() => {
    let filtered = [...employees];
    if (selectedCompany) {
      filtered = filtered.filter(emp => emp.company === selectedCompany);
    }
    if (selectedDepartment) {
      filtered = filtered.filter(emp => emp.department === selectedDepartment);
    }
    setAvailableEmployees(filtered);
  }, [selectedCompany, selectedDepartment, employees]);

  // Extract unique departments from employees based on selected company
  useEffect(() => {
    let filtered = [...employees];
    if (selectedCompany) {
      filtered = filtered.filter(emp => emp.company === selectedCompany);
    }
    const uniqueDepts = [...new Set(filtered.map(emp => emp.department).filter(Boolean))];
    setDepartments(uniqueDepts);
  }, [selectedCompany, employees]);

  const setDefaultDateRange = () => {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
    const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));
    
    const startOfWeek = new Date();
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day + (day === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    const startOfLastWeek = new Date();
    startOfLastWeek.setDate(startOfLastWeek.getDate() - startOfLastWeek.getDay() - 6);
    startOfLastWeek.setHours(0, 0, 0, 0);
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(endOfLastWeek.getDate() + 6);
    endOfLastWeek.setHours(23, 59, 59, 999);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    endOfLastMonth.setHours(23, 59, 59, 999);

    switch(dateRange) {
      case "today":
        setFromDate(startOfToday.toISOString().split('T')[0]);
        setToDate(endOfToday.toISOString().split('T')[0]);
        break;
      case "yesterday":
        setFromDate(startOfYesterday.toISOString().split('T')[0]);
        setToDate(endOfYesterday.toISOString().split('T')[0]);
        break;
      case "thisWeek":
        setFromDate(startOfWeek.toISOString().split('T')[0]);
        setToDate(endOfWeek.toISOString().split('T')[0]);
        break;
      case "lastWeek":
        setFromDate(startOfLastWeek.toISOString().split('T')[0]);
        setToDate(endOfLastWeek.toISOString().split('T')[0]);
        break;
      case "thisMonth":
        setFromDate(startOfMonth.toISOString().split('T')[0]);
        setToDate(endOfMonth.toISOString().split('T')[0]);
        break;
      case "lastMonth":
        setFromDate(startOfLastMonth.toISOString().split('T')[0]);
        setToDate(endOfLastMonth.toISOString().split('T')[0]);
        break;
      case "custom":
        if (customFromDate) setFromDate(customFromDate);
        if (customToDate) setToDate(customToDate);
        break;
      default:
        break;
    }
  };

  const handleCustomDateChange = () => {
    if (customFromDate && customToDate) {
      setFromDate(customFromDate);
      setToDate(customToDate);
    }
  };

  const getFilteredData = useCallback(() => {
    let data;
    if (currentTab === "attendance") {
      data = [...attendanceRecords];
    } else if (currentTab === "leave") {
      data = [...leaveRecords];
    } else {
      data = [...employees];
    }

    // Apply company filter
    if (selectedCompany && currentTab !== "employee") {
      data = data.filter(item => item.company === selectedCompany);
    }

    // Apply department filter
    if (selectedDepartment && currentTab !== "employee") {
      data = data.filter(item => item.department === selectedDepartment);
    }

    // Apply employee filter
    if (selectedEmployee) {
      if (currentTab === "attendance") {
        data = data.filter(item => item.employeeName === selectedEmployee);
      } else if (currentTab === "leave") {
        data = data.filter(item => item.employee === selectedEmployee);
      } else {
        data = data.filter(item => item.name === selectedEmployee);
      }
    }

    // Apply date filter
    if (fromDate && currentTab !== "employee") {
      if (currentTab === "attendance") {
        data = data.filter(item => item.date >= fromDate);
      } else if (currentTab === "leave") {
        data = data.filter(item => item.fromDate >= fromDate);
      }
    }
    if (toDate && currentTab !== "employee") {
      if (currentTab === "attendance") {
        data = data.filter(item => item.date <= toDate);
      } else if (currentTab === "leave") {
        data = data.filter(item => item.toDate <= toDate);
      }
    }

    // Apply search
    if (searchTerm) {
      data = data.filter(item => 
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return data;
  }, [currentTab, attendanceRecords, leaveRecords, employees, selectedCompany, selectedDepartment, selectedEmployee, fromDate, toDate, searchTerm]);

  const filteredData = getFilteredData();
  const totalFiltered = filteredData.length;
  const totalPages = Math.ceil(totalFiltered / perPage);
  const start = (currentPage - 1) * perPage;
  const pageData = filteredData.slice(start, start + perPage);

  const handleResetFilters = () => {
    setSelectedCompany("");
    setSelectedDepartment("");
    setSelectedEmployee("");
    setDateRange("thisMonth");
    setCustomFromDate("");
    setCustomToDate("");
    setSearchTerm("");
    setCurrentPage(1);
    showToast("Filters reset successfully", "success");
  };

  const handleApplyFilters = () => {
    if (dateRange === "custom") {
      handleCustomDateChange();
    }
    setCurrentPage(1);
    showToast("Filters applied successfully", "success");
  };

  const handleExport = () => {
    showToast(`Exporting ${exportReportType} report in ${exportFormat.toUpperCase()} format...`, "success");
    setTimeout(() => {
      showToast("Report exported successfully!", "success");
      setShowExportModal(false);
    }, 1500);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "Present": return "status-present";
      case "Absent": return "status-absent";
      case "Late": return "status-late";
      case "Approved": return "status-present";
      case "Pending": return "status-pending";
      default: return "";
    }
  };

  const getStatusText = (status) => {
    return status || "-";
  };

  const renderTableHeader = () => {
    if (currentTab === "attendance") {
      return (
        <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">S.No</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Employee</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Department</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Date</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Punch In</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Punch Out</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
        </tr>
      );
    } else if (currentTab === "leave") {
      return (
        <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">S.No</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Employee</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Department</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Leave Type</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">From Date</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">To Date</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Days</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
        </tr>
      );
    } else {
      return (
        <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">S.No</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Employee Name</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Department</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Designation</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Company</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Joining Date</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
        </tr>
      );
    }
  };

  const renderTableBody = () => {
    if (pageData.length === 0) {
      return (
        <tr>
          <td colSpan={currentTab === "attendance" ? 7 : currentTab === "leave" ? 8 : 7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            <div className="flex flex-col items-center justify-center gap-2">
              <i className="fas fa-chart-line text-4xl text-gray-300 dark:text-gray-600"></i>
              <p>No data found</p>
            </div>
          </td>
        </tr>
      );
    }

    if (currentTab === "attendance") {
      return pageData.map((item, idx) => (
        <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{start + idx + 1}</td>
          <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">{item.employeeName}</td>
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.department || "-"}</td>
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.date}</td>
          <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">{item.punchIn}</td>
          <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">{item.punchOut}</td>
          <td className="px-4 py-3">
            <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
              {getStatusText(item.status)}
            </span>
          </td>
        </tr>
      ));
    } else if (currentTab === "leave") {
      return pageData.map((item, idx) => (
        <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{start + idx + 1}</td>
          <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">{item.employee}</td>
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.department || "-"}</td>
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.type}</td>
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.fromDate}</td>
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.toDate}</td>
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.days}</td>
          <td className="px-4 py-3">
            <span className={`status-badge ${getStatusBadgeClass(item.status)}`}>
              {item.status}
            </span>
          </td>
        </tr>
      ));
    } else {
      return pageData.map((item, idx) => (
        <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{start + idx + 1}</td>
          <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">{item.name}</td>
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.department}</td>
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.designation}</td>
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.company}</td>
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.joiningDate}</td>
          <td className="px-4 py-3">
            <span className="status-badge status-present">{item.status}</span>
          </td>
        </tr>
      ));
    }
  };

  const Pagination = () => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);
      
      if (endPage - startPage + 1 < maxVisible && startPage > 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    };

    if (totalPages <= 1) return null;

    return (
      <div className="mt-5 flex flex-wrap justify-between items-center gap-3">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Showing {totalFiltered ? start + 1 : 0} to {Math.min(start + perPage, totalFiltered)} of {totalFiltered} entries
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ‹
          </button>
          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-lg border text-sm transition-colors ${
                currentPage === page
                  ? "bg-green-500 border-green-500 text-white"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </div>
      </div>
    );
  };

  // Get unique companies for filter
  const uniqueCompanies = [...new Set(employees.map(emp => emp.company).filter(Boolean))];

  return (
    <div className="app flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`flex-1 min-w-0 w-full overflow-x-hidden ${!isMobile ? 'md:ml-[72px]' : ''}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content px-4 py-4 md:px-6 md:py-6 w-full overflow-x-hidden">
          
          {/* Report Tabs */}
          <div className="flex flex-wrap gap-3 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <button
              onClick={() => { setCurrentTab("attendance"); setCurrentPage(1); }}
              className={`px-5 md:px-7 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                currentTab === "attendance"
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <i className="fas fa-fingerprint"></i> Attendance Report
            </button>
            <button
              onClick={() => { setCurrentTab("leave"); setCurrentPage(1); }}
              className={`px-5 md:px-7 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                currentTab === "leave"
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <i className="fas fa-calendar-check"></i> Leave Report
            </button>
            <button
              onClick={() => { setCurrentTab("employee"); setCurrentPage(1); }}
              className={`px-5 md:px-7 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                currentTab === "employee"
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <i className="fas fa-users"></i> Employee Report
            </button>
          </div>

          {/* Filters Bar */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-5 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Company Filter */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  <i className="fas fa-building mr-1"></i> Company
                </label>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500"
                >
                  <option value="">All Companies</option>
                  {uniqueCompanies.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  <i className="fas fa-diagram-project mr-1"></i> Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500"
                  disabled={!selectedCompany && currentTab !== "employee"}
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Employee Filter */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  <i className="fas fa-user mr-1"></i> Employee
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500"
                >
                  <option value="">All Employees</option>
                  {availableEmployees.map(emp => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
              </div>

              {/* Date Range Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  <i className="fas fa-calendar-alt mr-1"></i> Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="thisWeek">This Week</option>
                  <option value="lastWeek">Last Week</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>

            {/* Custom Date Range */}
            {dateRange === "custom" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    <i className="fas fa-calendar-day mr-1"></i> From Date
                  </label>
                  <input
                    type="date"
                    value={customFromDate}
                    onChange={(e) => setCustomFromDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    <i className="fas fa-calendar-day mr-1"></i> To Date
                  </label>
                  <input
                    type="date"
                    value={customToDate}
                    onChange={(e) => setCustomToDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
            )}

            {/* Filter Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 rounded-full bg-green-500 text-white font-semibold text-sm flex items-center gap-2 hover:bg-green-600 transition-all"
              >
                <i className="fas fa-filter"></i> Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                <i className="fas fa-undo-alt"></i> Reset
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-5">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 text-sm shadow-sm">
              <span className="text-gray-500 dark:text-gray-400">Show</span>
              <select
                value={perPage}
                onChange={(e) => { setPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
                className="bg-transparent border-none outline-none font-semibold text-gray-800 dark:text-gray-200 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-gray-500 dark:text-gray-400">entries</span>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 shadow-sm">
                <i className="fas fa-search text-gray-400 text-sm"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Search records..."
                  className="bg-transparent border-none outline-none text-sm text-gray-800 dark:text-gray-200 w-full sm:w-48"
                />
              </div>
              <button
                onClick={() => setShowExportModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <i className="fas fa-download"></i> Export
              </button>
            </div>
          </div>

          {/* Report Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto shadow-soft">
            <div className="min-w-[800px] md:min-w-0">
              <table className="w-full border-collapse">
                <thead>
                  {renderTableHeader()}
                </thead>
                <tbody>
                  {renderTableBody()}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination />
        </main>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-soft-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <i className="fas fa-download text-green-500"></i>
                Export Report
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-red-500 transition-colors text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <i className="fas fa-file-alt text-green-500 mr-1"></i> Report Type
              </label>
              <select
                value={exportReportType}
                onChange={(e) => setExportReportType(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500"
              >
                <option value="attendance">Attendance Report</option>
                <option value="leave">Leave Report</option>
                <option value="employee">Employee Report</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <i className="fas fa-calendar-alt text-green-500 mr-1"></i> Date Range
              </label>
              <select
                value={exportDateRange}
                onChange={(e) => setExportDateRange(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="thisWeek">This Week</option>
                <option value="lastWeek">Last Week</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {exportDateRange === "custom" && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">From Date</label>
                  <input
                    type="date"
                    value={exportCustomFrom}
                    onChange={(e) => setExportCustomFrom(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">To Date</label>
                  <input
                    type="date"
                    value={exportCustomTo}
                    onChange={(e) => setExportCustomTo(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <i className="fas fa-file-export text-green-500 mr-1"></i> Format
              </label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500"
              >
                <option value="csv">CSV</option>
                <option value="excel">Excel (XLSX)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-full font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 rounded-full font-semibold bg-green-500 text-white hover:bg-green-600 transition-all flex items-center gap-2 text-sm"
              >
                <i className="fas fa-download"></i> Export Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;