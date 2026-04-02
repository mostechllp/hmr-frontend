import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import EntriesSelector from '../components/common/EntriesSelector';
import { showToast } from '../components/common/Toast';
import Pagination from '../components/common/Paginations';
import { deleteAgreement, fetchAgreements } from '../store/slices/agreementsSlice';

const Agreements = () => {
  const dispatch = useDispatch();
  const { agreements = [] } = useSelector(
    (state) => state.agreements || {},
  );
  const [currentFolder, setCurrentFolder] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
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
    dispatch(fetchAgreements());
  }, [dispatch]);

  const folders = [
    { name: 'All Files', value: 'all', icon: 'fas fa-folder-open' },
    { name: 'Agreements', value: 'Agreements', icon: 'fas fa-file-signature' },
    { name: 'HR', value: 'HR', icon: 'fas fa-users' },
    { name: 'IT', value: 'IT', icon: 'fas fa-code' },
    { name: 'Finance', value: 'Finance', icon: 'fas fa-chart-line' },
    { name: 'Legal', value: 'Legal', icon: 'fas fa-gavel' },
  ];

  const getFilteredAgreements = () => {
    let filtered = agreements;
    if (currentFolder !== 'all') {
      filtered = filtered.filter(ag => ag.folder === currentFolder);
    }
    if (searchTerm) {
      filtered = filtered.filter(ag => 
        ag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ag.folder.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ag.shareWith.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredAgreements = getFilteredAgreements();
  const totalFiltered = filteredAgreements.length;
  const totalPages = Math.ceil(totalFiltered / perPage);
  const start = (currentPage - 1) * perPage;
  const pageAgreements = filteredAgreements.slice(start, start + perPage);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const result = await dispatch(deleteAgreement(id));
      if (deleteAgreement.fulfilled.match(result)) {
        showToast(`${name} deleted successfully`, 'success');
      } else {
        showToast('Failed to delete agreement', 'error');
      }
    }
  };

  const handleView = (agreement) => {
    alert(`📄 AGREEMENT DETAILS\n\nName: ${agreement.name}\nFolder: ${agreement.folder}\nShared With: ${agreement.shareWith}\nExpiry: ${agreement.expiry || 'No Expiry'}`);
  };

  const getExpiryClass = (expiryDate) => {
    if (!expiryDate) return '';
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'text-red-500 font-semibold';
    if (diffDays <= 30) return 'text-amber-500 font-semibold';
    return '';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No Expiry';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getFolderClass = (folder) => {
    const classes = {
      'Agreements': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      'HR': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      'IT': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      'Finance': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      'Legal': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    };
    return classes[folder] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
  };

  // Calculate stats
  const total = agreements.length;
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  let expiringSoon = 0;
  let expired = 0;
  
  agreements.forEach(agreement => {
    if (agreement.expiry) {
      const expiryDate = new Date(agreement.expiry);
      if (expiryDate < today) {
        expired++;
      } else if (expiryDate <= thirtyDaysFromNow) {
        expiringSoon++;
      }
    }
  });

  return (
    <div className="app flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`flex-1 min-w-0 w-full overflow-x-hidden ${!isMobile ? 'md:ml-[72px]' : ''}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content px-4 py-4 md:px-6 md:py-6 w-full overflow-x-hidden">
          
          {/* Stats Cards - Responsive Grid */}
          <div className="stats-grid grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5 mb-6">
            {/* Total Agreements Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-5 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-2 md:mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-file-contract text-green-600 dark:text-green-400 text-base md:text-xl"></i>
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-green-600 dark:text-green-400">{total}</div>
              <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Total Agreements</div>
            </div>

            {/* Expiring Soon Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-5 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-2 md:mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-clock text-amber-600 dark:text-amber-400 text-base md:text-xl"></i>
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-amber-600 dark:text-amber-400">{expiringSoon}</div>
              <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Expiring Soon (30 days)</div>
            </div>

            {/* Expired Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-5 border border-gray-200 dark:border-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex justify-between items-start mb-2 md:mb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-calendar-times text-red-600 dark:text-red-400 text-base md:text-xl"></i>
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-red-600 dark:text-red-400">{expired}</div>
              <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Expired</div>
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-600 dark:from-gray-200 dark:to-green-400 bg-clip-text text-transparent">
              Agreement Files
            </h2>
          </div>

          {/* Folder Tabs - Horizontal Scroll on Mobile */}
          <div className="overflow-x-auto pb-2 mb-4 md:mb-5 -mx-4 px-4">
            <div className="flex gap-2 min-w-max border-b border-gray-200 dark:border-gray-700 pb-3">
              {folders.map((folder) => (
                <button
                  key={folder.value}
                  onClick={() => {
                    setCurrentFolder(folder.value);
                    setCurrentPage(1);
                  }}
                  className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    currentFolder === folder.value
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <i className={`${folder.icon} mr-1 text-[10px] md:text-xs`}></i>
                  <span className="hidden sm:inline">{folder.name}</span>
                  <span className="sm:hidden">{folder.name === 'All Files' ? 'All' : folder.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions Bar - Fully Responsive */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-5">
            <EntriesSelector value={perPage} onChange={setPerPage} />
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search records..." />
              <Link 
                to="/agreements/add-agreement" 
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                <i className="fas fa-plus-circle"></i> Add Agreement
              </Link>
            </div>
          </div>

          {/* Agreements Table - Horizontal Scroll on Mobile */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto shadow-soft">
            <div className="min-w-[800px] md:min-w-0">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">Sl.No.</th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">Name</th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">Folder</th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">Share With</th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">Expiry Date</th>
                    <th className="px-3 md:px-4 py-2 md:py-3 text-left text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageAgreements.map((agreement, idx) => (
                    <tr key={agreement.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center">{start + idx + 1}</td>
                      <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200">{agreement.name}</td>
                      <td className="px-3 md:px-4 py-2 md:py-3">
                        <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold ${getFolderClass(agreement.folder)} whitespace-nowrap`}>
                          {agreement.folder}
                        </span>
                       </td>
                      <td className="px-3 md:px-4 py-2 md:py-3">
                        <span className="inline-flex items-center gap-1 md:gap-1.5 bg-gray-100 dark:bg-gray-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs whitespace-nowrap">
                          <i className="fas fa-share-alt text-gray-500 text-[8px] md:text-xs"></i>
                          <span className="hidden sm:inline">{agreement.shareWith}</span>
                          <span className="sm:hidden">{agreement.shareWith.length > 10 ? agreement.shareWith.substring(0, 8) + '...' : agreement.shareWith}</span>
                        </span>
                       </td>
                      <td className={`px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm ${getExpiryClass(agreement.expiry)} whitespace-nowrap`}>
                        {formatDate(agreement.expiry)}
                       </td>
                      <td className="px-3 md:px-4 py-2 md:py-3">
                        <div className="flex gap-1 md:gap-2">
                          <button 
                            onClick={() => handleView(agreement)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500 transition-colors"
                            title="View"
                          >
                            <i className="fas fa-eye text-xs md:text-sm"></i>
                          </button>
                          <Link 
                            to={`/edit-agreement/${agreement.id}`}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-amber-500 transition-colors"
                            title="Edit"
                          >
                            <i className="fas fa-edit text-xs md:text-sm"></i>
                          </Link>
                          <button 
                            onClick={() => handleDelete(agreement.id, agreement.name)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors"
                            title="Delete"
                          >
                            <i className="fas fa-trash text-xs md:text-sm"></i>
                          </button>
                        </div>
                        </td>
                      </tr>
                    ))}
                    {pageAgreements.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          No agreements found
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
      </div>
    );
  };

export default Agreements;