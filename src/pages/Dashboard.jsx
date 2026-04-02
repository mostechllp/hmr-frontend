/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../store/slices/employeeSlice';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import StatsCard from '../components/dashboard/StatsCard';
import AttendanceChart from '../components/dashboard/AttendanceChart';
import PunchChart from '../components/dashboard/PunchChart';
import RecentFiles from '../components/dashboard/RecentFiles';
import Loader from '../components/common/Loader';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { employees, loading } = useSelector((state) => state.employees);
  const [stats, setStats] = useState({
    totalEmployees: 33,
    punchedInToday: 0,
    lateArrivals: 0,
    absentToday: 33,
  });

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-[72px] md:ml-[72px]">
        <Header />
        <main className="p-4 md:p-6 max-w-[1600px] mx-auto">
          <WelcomeBanner stats={stats} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <StatsCard
              title="Total Employees"
              value={stats.totalEmployees}
              icon="fas fa-users"
              color="green"
            />
            <StatsCard
              title="Punched In Today"
              value={stats.punchedInToday}
              icon="fas fa-fingerprint"
              color="blue"
            />
            <StatsCard
              title="Late Arrivals"
              value={stats.lateArrivals}
              icon="fas fa-clock"
              color="amber"
            />
            <StatsCard
              title="Absent Today"
              value={stats.absentToday}
              icon="fas fa-user-slash"
              color="red"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <AttendanceChart />
            <PunchChart />
          </div>

          <RecentFiles />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;