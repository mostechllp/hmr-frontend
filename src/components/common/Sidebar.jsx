import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const isExpanded = isMobile ? isOpen : isOpen;

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setIsOpen]);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location, isMobile, setIsOpen]);

  const mainNavItems = [
    { path: "/dashboard", icon: "fas fa-table-cells-large", label: "Dashboard" },
    { path: "/employees", icon: "fas fa-users", label: "Employees" },
    {
      path: "/organizations",
      icon: "fas fa-briefcase",
      label: "Organizations",
    },
    { path: "/agreements", icon: "fas fa-file-lines", label: "Agreements" },
    { path: "/attendances", icon: "fas fa-calendar-check", label: "Attendance" },
    { path: "/leaves", icon: "fas fa-user-clock", label: "Leaves" },
    { path: "/departments", icon: "fas fa-layer-group", label: "Departments" },
    { path: "/designations", icon: "fas fa-tags", label: "Designations" },
    { path: "/wfh", icon: "fas fa-house", label: "WFH Requests" },
    { path: "/task-reports", icon: "fas fa-clipboard-list", label: "Task Reports" },
    { path: null, icon: "fas fa-file-lines", label: "Attendance Requests" },
    { path: null, icon: "fas fa-calendar-days", label: "Meetings" },
  ];

  const settingsNavItem = { path: "/settings", icon: "fas fa-gear", label: "Settings" };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 flex h-full flex-col border-r border-slate-200 bg-white transition-all duration-300
          ${
            isMobile
              ? `${isOpen ? "translate-x-0" : "-translate-x-full"} w-[250px]`
              : `${isOpen ? "w-[250px]" : "w-[84px]"}`
          }
        `}
      >
        <div
          className={`flex border-b border-slate-200 py-5 ${
            isExpanded ? "items-center justify-center px-6" : "items-center justify-center px-3"
          }`}
        >
          <img
            src="https://violet-leopard-500489.hostingersite.com/hr/public/assets/images/hr-logo2.jpg"
            alt="HMR Logo"
            className={`object-contain transition-all duration-300 ${
              isExpanded ? "h-11 w-auto" : "h-9 w-9"
            }`}
          />
        </div>

        <nav
          className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {mainNavItems.map((item) => (
            item.path ? (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => isMobile && setIsOpen(false)}
                className={({ isActive }) =>
                  `mb-1 flex items-center rounded-2xl py-3 text-[15px] font-normal transition-all duration-200 ${
                    isActive
                      ? "bg-[#355c45] text-white shadow-sm"
                      : "text-slate-600 hover:bg-[#a7d9a9] hover:text-white"
                  } ${isExpanded ? "gap-3 px-4 justify-start" : "justify-center px-3"}`
                }
              >
                <i className={`${item.icon} w-5 text-sm`}></i>
                {isExpanded && <span>{item.label}</span>}
              </NavLink>
            ) : (
              <div
                key={item.label}
                className={`mb-1 flex items-center rounded-2xl py-3 text-[15px] font-normal text-slate-600 hover:bg-[#a7d9a9] hover:text-white ${
                  isExpanded ? "gap-3 px-4 justify-start" : "justify-center px-3"
                }`}
              >
                <i className={`${item.icon} w-5 text-sm`}></i>
                {isExpanded && <span>{item.label}</span>}
              </div>
            )
          ))}
          <NavLink
            to="/reports"
            onClick={() => isMobile && setIsOpen(false)}
            className={({ isActive }) =>
              `mb-1 flex items-center rounded-2xl py-3 text-[15px] font-normal transition-all duration-200 ${
                isActive
                  ? "bg-[#355c45] text-white shadow-sm"
                  : "text-slate-600 hover:bg-[#a7d9a9] hover:text-white"
              } ${isExpanded ? "gap-3 px-4 justify-start" : "justify-center px-3"}`
            }
          >
            <i className="fas fa-arrow-trend-up w-5 text-sm"></i>
            {isExpanded && <span>Reports</span>}
          </NavLink>
        </nav>

        <div className="px-3 py-4">
          <div className="border-t border-slate-200 pt-3">
            <NavLink
              to={settingsNavItem.path}
              onClick={() => isMobile && setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center rounded-2xl py-3 text-[15px] font-normal transition-all duration-200 ${
                  isActive
                    ? "bg-[#355c45] text-white shadow-sm"
                    : "text-slate-600 hover:bg-[#a7d9a9] hover:text-white"
                } ${isExpanded ? "gap-3 px-4 justify-start" : "justify-center px-3"}`
              }
            >
              <i className={`${settingsNavItem.icon} w-5 text-sm`}></i>
              {isExpanded && <span>{settingsNavItem.label}</span>}
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
