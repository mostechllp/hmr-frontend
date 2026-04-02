import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import EntriesSelector from '../components/common/EntriesSelector';
import Loader from '../components/common/Loader';
import UploadAttendanceModal from '../components/attendance/UploadAttendanceModal';
import { showToast } from '../components/common/Toast';
import Pagination from '../components/common/Paginations';
import { fetchAttendanceRecords, uploadAttendanceFile } from '../store/slices/attendanceSlice';

const Attendances = () => {
  const dispatch = useDispatch();
  const { records, loading } = useSelector((state) => state.attendance);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [companyFilter, setCompanyFilter] = useState('all');
  const [nameFilter, setNameFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchAttendanceRecords());
  }, [dispatch]);

  const getFilteredRecords = () => {
    let filtered = records;
    if (companyFilter !== 'all') {
      filtered = filtered.filter(r => r.company === companyFilter);
    }
    if (nameFilter) {
      filtered = filtered.filter(r => r.employeeName.toLowerCase().includes(nameFilter.toLowerCase()));
    }
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.date.includes(searchTerm)
      );
    }
    return filtered;
  };

  const filteredRecords = getFilteredRecords();
  const totalFiltered = filteredRecords.length;
  const totalPages = Math.ceil(totalFiltered / perPage);
  const start = (currentPage - 1) * perPage;
  const pageRecords = filteredRecords.slice(start, start + perPage);

  // Calculate stats
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).replace(/\//g, '-');
  
  const todayRecords = records.filter(r => r.date === today);
  const punchedInToday = todayRecords.length;
  const lateToday = todayRecords.filter(r => r.isLate).length;
  const absentToday = 34 - punchedInToday;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).replace(/\//g, '-');
  const punchOutYesterday = records.filter(r => r.date === yesterdayStr && r.hasPunchOut).length;

  const handleUploadComplete = (data) => {
    dispatch(uploadAttendanceFile(data));
    showToast('Attendance file uploaded successfully!', 'success');
    setShowUploadModal(false);
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-[72px] md:ml-[72px]">
        <Header />
        <main className="p-4 md:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-users text-green-600 dark:text-green-400 text-lg"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">34</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Employees</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-fingerprint text-blue-600 dark:text-blue-400 text-lg"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{punchedInToday}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Punched In Today</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-clock text-amber-600 dark:text-amber-400 text-lg"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{lateToday}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Late Today</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-user-slash text-red-600 dark:text-red-400 text-lg"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{absentToday}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Absent Today</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-sign-out-alt text-purple-600 dark:text-purple-400 text-lg"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{punchOutYesterday}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Punch Out Yesterday</div>
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-600 dark:from-gray-200 dark:to-green-400 bg-clip-text text-transparent">
              Attendance Records <span className="text-sm bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full ml-2">
                <i className="fas fa-calendar-check mr-1"></i> Daily Log
              </span>
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-5">
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500"
            >
              <option value="all">All Companies</option>
              <option value="THESAY">THESAY</option>
              <option value="SAYGEN">SAYGEN</option>
              <option value="warehouse">Warehouse</option>
              <option value="farmassay">Farmassay</option>
            </select>
            
            <input
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Employee Name..."
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500 w-48"
            />
            
            <button
              onClick={() => alert("📅 Date Range Filter\n\nQuick options:\n• Today\n• Yesterday\n• This Week\n• Last 7 Days\n• Custom Range")}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-calendar-alt"></i> Date Filter <i className="fas fa-chevron-down text-xs"></i>
            </button>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
            <EntriesSelector value={perPage} onChange={setPerPage} />
            <div className="flex gap-3">
              <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search records..." />
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <i className="fas fa-plus-circle"></i> Upload Logs
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto shadow-soft">
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Sl.No.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Employee Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Punch In</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Punch Out</th>
                </tr>
              </thead>
              <tbody>
                {pageRecords.map((record, idx) => (
                  <tr key={record.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-center">{start + idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs">
                        <i className="fas fa-building text-gray-500"></i>
                        {record.company}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">{record.employeeName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{record.date}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{record.punchIn}</span>
                      {record.isLate && (
                        <span className="inline-block ml-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full">Late</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {record.hasPunchOut ? (
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{record.punchOut}</span>
                      ) : (
                        <span className="inline-block bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded-full">Not Punched Out</span>
                      )}
                    </td>
                  </tr>
                ))}
                {pageRecords.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No attendance records found
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

      {/* Upload Modal */}
      <UploadAttendanceModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUploadComplete}
      />
    </div>
  );
};

export default Attendances;