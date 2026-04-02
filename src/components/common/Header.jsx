import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { markAsRead, markAllRead } from '../../store/slices/notificationSlice';
import { logoutUser } from '../../store/slices/authSlice';

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    };
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllRead());
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              HR Management
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Command Center
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
            <i className="far fa-calendar-alt mr-2"></i>
            <span>{currentDate}</span>
          </div>

          {/* Theme Toggle will be added separately */}

          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-10 h-10 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <i className="fas fa-bell text-gray-600 dark:text-gray-300"></i>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-12 right-0 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-soft-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-green-500 hover:text-green-600"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-green-50 dark:bg-green-900/20' : ''
                        } hover:bg-gray-50 dark:hover:bg-gray-700`}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {notification.title}
                        </div>
                        <small className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                          {notification.time}
                        </small>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center bg-gray-50 dark:bg-gray-700/50">
                  <button className="text-xs text-green-500 hover:text-green-600">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="w-10 h-10 rounded-xl overflow-hidden shadow-md"
            >
              <img
                src="https://violet-leopard-500489.hostingersite.com/hr/public/storage/avatars/jnBiWzD1Lt4YMtHS4hK2CS0Pcbo3vSOZw7Xd6px4.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>

            {showProfile && (
              <div className="absolute top-12 right-0 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-soft-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                <div className="p-4 flex gap-3 border-b border-gray-200 dark:border-gray-700">
                  <img
                    src="https://violet-leopard-500489.hostingersite.com/hr/public/storage/avatars/jnBiWzD1Lt4YMtHS4hK2CS0Pcbo3vSOZw7Xd6px4.jpg"
                    alt="Profile"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                      {user?.name || 'HR Admin'}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email || 'hr@thesay.ae'}
                    </p>
                  </div>
                </div>
                <NavLink
                  to="/settings"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setShowProfile(false)}
                >
                  <i className="fas fa-user text-green-500 w-5"></i>
                  <span className="text-sm text-gray-700 dark:text-gray-300">My Profile</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <i className="fas fa-arrow-right-from-bracket text-green-500 w-5"></i>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;