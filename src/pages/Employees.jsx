import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import EntriesSelector from '../components/common/EntriesSelector';
import Loader from '../components/common/Loader';
import { showToast } from '../components/common/Toast';
import { 
  fetchEmployees, 
  setCurrentPage, 
  setPerPage, 
  setFilters,
  deleteEmployee,
  updateEmployeeStatus
} from '../store/slices/employeeSlice';
import Pagination from '../components/common/Paginations';

const Employees = () => {
  const dispatch = useDispatch();
  const { employees, loading, currentPage, perPage, filters } = useSelector((state) => state.employees);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDeleteEmployee = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      const result = await dispatch(deleteEmployee(id));
      if (deleteEmployee.fulfilled.match(result)) {
        showToast(`${name} deleted successfully`, 'success');
      } else {
        showToast('Failed to delete employee', 'error');
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const result = await dispatch(updateEmployeeStatus({ id, status: newStatus }));
    if (updateEmployeeStatus.fulfilled.match(result)) {
      showToast(`Employee status updated to ${newStatus}`, 'success');
    }
  };

  const getFilteredEmployees = () => {
    let filtered = employees;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(emp => emp.status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredEmployees = getFilteredEmployees();
  const totalFiltered = filteredEmployees.length;
  const totalPages = Math.ceil(totalFiltered / perPage);
  const start = (currentPage - 1) * perPage;
  const pageEmployees = filteredEmployees.slice(start, start + perPage);

  const activeCount = employees.filter(e => e.status === 'Active').length;
  const inactiveCount = employees.filter(e => e.status === 'Inactive').length;

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
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-user-check text-green-600 dark:text-green-400 text-lg"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCount}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Active Employees</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-user-slash text-red-600 dark:text-red-400 text-lg"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{inactiveCount}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Inactive Employees</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-users text-blue-600 dark:text-blue-400 text-lg"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{employees.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Total Employees</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-calendar-times text-amber-600 dark:text-amber-400 text-lg"></i>
                </div>
              </div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">0</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">On Leave</div>
            </div>
          </div>

          {/* Header with Filters */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-600 dark:from-gray-200 dark:to-green-400 bg-clip-text text-transparent">
              Employee Directory
            </h2>
            <div className="flex gap-2 mt-3 sm:mt-0">
              <button
                onClick={() => handleStatusFilter('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  statusFilter === 'all' 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleStatusFilter('Active')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  statusFilter === 'Active' 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleStatusFilter('Inactive')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  statusFilter === 'Inactive' 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
            <EntriesSelector value={perPage} onChange={(val) => dispatch(setPerPage(val))} />
            <div className="flex gap-3">
              <SearchBar value={searchTerm} onChange={handleSearch} placeholder="Search by name..." />
              <Link 
                to="/employees/add-employee" 
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <i className="fas fa-plus-circle"></i> Add Employee
              </Link>
            </div>
          </div>

          {/* Employees Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto shadow-soft">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">S.L.NO.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">NAME</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">DESIGNATION</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">DEPARTMENT</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">COMPANY</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">STATUS</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {pageEmployees.map((emp, idx) => (
                  <tr key={emp.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-center">{start + idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">{emp.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{emp.designation}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{emp.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{emp.company}</td>
                    <td className="px-4 py-3">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={emp.status === 'Active'}
                            onChange={() => handleStatusToggle(emp.id, emp.status)}
                          />
                          <div className="w-11 h-5 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        </div>
                        <span className={`text-xs font-semibold ${emp.status === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {emp.status}
                        </span>
                      </label>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => alert(`Viewing ${emp.name}`)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500 transition-colors"
                          title="View"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <Link 
                          to={`/edit-employee/${emp.id}`}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-amber-500 transition-colors"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button 
                          onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors"
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pageEmployees.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
    </div>
  );
};

export default Employees;