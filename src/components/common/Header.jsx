import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { markAsRead, markAllRead } from "../../store/slices/notificationSlice";
import { logoutUser } from "../../store/slices/authSlice";
import { fetchNotifications } from "../../store/slices/notificationSlice";

const Header = ({ onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector(
    (state) => state.notifications,
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllRead());
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "HR";

  const displayName = "HR";
  const displayRole = "Administrator";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-slate-50/90 backdrop-blur px-4 py-3 md:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-emerald-600 shadow-sm"
            aria-label="Toggle menu"
          >
            <i className="fas fa-border-all text-base"></i>
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Square action buttons (match screenshot style) */}
          <button
            type="button"
            className="hidden md:flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
            title="Quick action"
          >
            <i className="fas fa-arrow-up-from-bracket text-sm"></i>
          </button>

          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
              title="Notifications"
            >
              <i className="fas fa-bell text-sm"></i>
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 min-w-[16px] rounded-full bg-emerald-500 px-1 py-0 text-center text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-800">
                    Notifications
                  </h3>
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-emerald-600 hover:text-emerald-700"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`cursor-pointer border-b border-slate-100 p-3 transition-colors ${
                          !notification.read ? "bg-emerald-50" : ""
                        } hover:bg-slate-50`}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <div className="text-sm font-medium text-slate-800">
                          {notification.title}
                        </div>
                        <small className="mt-1 block text-xs text-slate-500">
                          {notification.time || "Just now"}
                        </small>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-slate-200 bg-slate-50 p-3 text-center">
                  <button
                    onClick={() =>
                      alert(
                        "All notifications: " +
                          notifications.map((n) => n.title).join("\n"),
                      )
                    }
                    className="text-xs text-emerald-600 hover:text-emerald-700"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 rounded-xl border border-transparent bg-transparent px-1 py-1.5 hover:border-slate-200"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                  {initials}
                </span>
                <div className="hidden min-w-0 text-left md:block">
                  <p className="truncate text-sm font-medium leading-none text-slate-700">
                    {displayName}
                  </p>
                  <p className="mt-1 truncate text-[11px] leading-none text-slate-400">
                    {displayRole}
                  </p>
                </div>
              </div>
              <div className="hidden min-w-0 text-left md:block">
                {/* kept above */}
              </div>
              <i className="fas fa-angle-down hidden text-xs text-slate-400 md:block"></i>
            </button>

            {showProfile && (
              <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                <div className="flex gap-3 border-b border-slate-200 p-4">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 font-semibold text-violet-600">
                      {initials}
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {displayName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {user?.email || displayRole}
                    </p>
                  </div>
                </div>
                <NavLink
                  to="/settings"
                  className="flex items-center gap-3 p-3 transition-colors hover:bg-slate-50"
                  onClick={() => setShowProfile(false)}
                >
                  <i className="fas fa-user w-5 text-emerald-500"></i>
                  <span className="text-sm text-slate-700">
                    My Profile
                  </span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-slate-50"
                >
                  <i className="fas fa-arrow-right-from-bracket w-5 text-emerald-500"></i>
                  <span className="text-sm text-slate-700">
                    Sign out
                  </span>
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
