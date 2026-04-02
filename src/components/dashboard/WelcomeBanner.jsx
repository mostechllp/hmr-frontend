import React from 'react';

const WelcomeBanner = ({ stats }) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-6 md:p-8 mb-6 flex flex-wrap justify-between items-center">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">{greeting}, HR! 👋</h2>
        <p className="text-white/80 text-sm mt-1">Here's what's happening today.</p>
      </div>
      <div className="flex gap-4 mt-4 md:mt-0">
        <div className="text-center bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl min-w-[80px]">
          <div className="text-2xl font-bold text-white">{stats.totalEmployees}</div>
          <div className="text-xs text-white/70">Total Staff</div>
        </div>
        <div className="text-center bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl min-w-[80px]">
          <div className="text-2xl font-bold text-white">{stats.punchedInToday}</div>
          <div className="text-xs text-white/70">Punched In</div>
        </div>
        <div className="text-center bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl min-w-[80px]">
          <div className="text-2xl font-bold text-white">{stats.absentToday}</div>
          <div className="text-xs text-white/70">Absent</div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;