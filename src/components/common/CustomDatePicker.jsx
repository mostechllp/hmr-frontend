import React, { useState, useRef, useEffect } from "react";

const CustomDatePicker = ({ value, onChange, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("day"); // "day" | "month" | "year"
  const [viewDate, setViewDate] = useState(() => {
    return value ? new Date(value) : new Date();
  });
  const pickerRef = useRef(null);

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const DAYS = ["SU","MO","TU","WE","TH","FR","SA"];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false);
        setView("day");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDate = value ? new Date(value + "T00:00:00") : null;

  const formatDisplay = (val) => {
    if (!val) return "";
    const d = new Date(val + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  // --- Day View ---
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const renderDayView = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    const cells = [];

    // Prev month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, currentMonth: false, prev: true });
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, currentMonth: true });
    }
    // Next month leading days
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, currentMonth: false, next: true });
    }

    return (
      <div className="p-3 w-72">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
            <i className="fas fa-chevron-left text-xs"></i>
          </button>
          <button type="button" onClick={() => setView("month")}
            className="font-semibold text-gray-800 dark:text-gray-200 hover:text-green-500 transition-colors">
            {new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </button>
          <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-semibold text-green-500 py-1">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {cells.map((cell, idx) => {
            const cellDateStr = cell.currentMonth
              ? `${year}-${String(month + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`
              : null;
            const isSelected = cellDateStr && selectedDate &&
              selectedDate.getFullYear() === year &&
              selectedDate.getMonth() === month &&
              selectedDate.getDate() === cell.day;
            const isToday = cell.currentMonth &&
              new Date().getFullYear() === year &&
              new Date().getMonth() === month &&
              new Date().getDate() === cell.day;

            return (
              <button
                key={idx}
                type="button"
                disabled={!cell.currentMonth}
                onClick={() => {
                  if (cell.currentMonth) {
                    onChange({ target: { id, value: cellDateStr } });
                    setIsOpen(false);
                    setView("day");
                  }
                }}
                className={`
                  text-center text-sm py-1.5 rounded-lg mx-0.5 my-0.5 transition-colors
                  ${!cell.currentMonth ? "text-gray-300 dark:text-gray-600 cursor-default" : "cursor-pointer"}
                  ${isSelected ? "bg-green-500 text-white font-semibold" : ""}
                  ${isToday && !isSelected ? "text-green-500 font-semibold" : ""}
                  ${cell.currentMonth && !isSelected ? "hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-300" : ""}
                `}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // --- Month View ---
  const renderMonthView = () => {
    const year = viewDate.getFullYear();
    return (
      <div className="p-3 w-72">
        <div className="flex items-center justify-between mb-4">
          <button type="button" onClick={() => setViewDate(new Date(year - 1, viewDate.getMonth(), 1))}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
            <i className="fas fa-chevron-left text-xs"></i>
          </button>
          <button type="button" onClick={() => setView("year")}
            className="font-bold text-gray-800 dark:text-gray-200 hover:text-green-500 transition-colors">
            {year}
          </button>
          <button type="button" onClick={() => setViewDate(new Date(year + 1, viewDate.getMonth(), 1))}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {MONTHS.map((m, idx) => {
            const isSelected = selectedDate &&
              selectedDate.getFullYear() === year &&
              selectedDate.getMonth() === idx;
            const isCurrent = new Date().getFullYear() === year && new Date().getMonth() === idx;
            return (
              <button key={m} type="button"
                onClick={() => { setViewDate(new Date(year, idx, 1)); setView("day"); }}
                className={`
                  py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isSelected ? "bg-green-500 text-white" : ""}
                  ${isCurrent && !isSelected ? "text-green-500 font-semibold" : ""}
                  ${!isSelected ? "hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-300" : ""}
                `}>
                {m}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // --- Year View ---
  const renderYearView = () => {
    const currentYear = viewDate.getFullYear();
    const startYear = Math.floor(currentYear / 10) * 10 - 1;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    return (
      <div className="p-3 w-72">
        <div className="flex items-center justify-between mb-4">
          <button type="button" onClick={() => setViewDate(new Date(currentYear - 10, viewDate.getMonth(), 1))}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
            <i className="fas fa-chevron-left text-xs"></i>
          </button>
          <span className="font-bold text-gray-800 dark:text-gray-200">
            {years[1]}–{years[10]}
          </span>
          <button type="button" onClick={() => setViewDate(new Date(currentYear + 10, viewDate.getMonth(), 1))}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {years.map((yr) => {
            const isSelected = selectedDate && selectedDate.getFullYear() === yr;
            const isCurrent = new Date().getFullYear() === yr;
            const isOutOfRange = yr === years[0] || yr === years[11];
            return (
              <button key={yr} type="button"
                onClick={() => { if (!isOutOfRange) { setViewDate(new Date(yr, viewDate.getMonth(), 1)); setView("month"); } }}
                className={`
                  py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isSelected && !isOutOfRange ? "bg-green-500 text-white" : ""}
                  ${isCurrent && !isSelected && !isOutOfRange ? "text-green-500 font-semibold" : ""}
                  ${isOutOfRange ? "text-gray-300 dark:text-gray-600 cursor-default" : ""}
                  ${!isSelected && !isOutOfRange ? "hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-300" : ""}
                `}>
                {yr}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={pickerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm md:text-base text-gray-800 dark:text-gray-200 cursor-pointer hover:border-green-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 flex items-center justify-between transition-all"
      >
        <span className={value ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"}>
          {value ? formatDisplay(value) : "Select date"}
        </span>
        <i className="fas fa-calendar-alt text-green-500 text-sm"></i>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
          {view === "day" && renderDayView()}
          {view === "month" && renderMonthView()}
          {view === "year" && renderYearView()}
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;