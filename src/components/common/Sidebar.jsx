import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(false);
    }
  }, [location, isMobile]);

  const navItems = [
    { path: '/dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
    { path: '/employees', icon: 'fas fa-users', label: 'Employees' },
    { path: '/organizations', icon: 'fas fa-briefcase', label: 'Organizations' },
    { path: '/agreements', icon: 'fas fa-file-signature', label: 'Agreements' },
    { path: '/attendances', icon: 'fas fa-fingerprint', label: 'Attendance' },
    { path: '/leaves', icon: 'fas fa-calendar-check', label: 'Leaves' },
    { path: '/reports', icon: 'fas fa-chart-line', label: 'Reports' },
    { path: '/settings', icon: 'fas fa-gear', label: 'Settings' },
  ];

  // eslint-disable-next-line no-unused-vars
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 z-50 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-[72px]'
        } ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'} hover:w-64 group`}
        onMouseEnter={() => !isMobile && setIsOpen(true)}
        onMouseLeave={() => !isMobile && setIsOpen(false)}
      >
        <div className="flex flex-col h-full">
          <div className="py-5 px-4 border-b border-white/10 flex justify-center items-center">
            <img
              src="https://violet-leopard-500489.hostingersite.com/hr/public/assets/images/hr-logo2.jpg"
              alt="HMR Logo"
              className={`${isOpen ? 'w-12 h-12' : 'w-10 h-10'} object-contain rounded-lg bg-white p-1 transition-all duration-300`}
            />
          </div>

          <nav className="flex-1 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? 'active' : ''}`
                }
              >
                <i className={`${item.icon} w-6 text-lg`}></i>
                <span className={`transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0">
                {user?.name?.charAt(0) || 'HR'}
              </div>
              <div className={`transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <h4 className="text-sm font-semibold text-white">{user?.name || 'HR Admin'}</h4>
                <p className="text-xs text-white/50">{user?.role || 'Administrator'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md"
      >
        <i className="fas fa-bars text-gray-800 dark:text-gray-200"></i>
      </button>
    </>
  );
};

export default Sidebar;