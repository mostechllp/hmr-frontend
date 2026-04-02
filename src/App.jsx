import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from './hooks/useTheme';
import { Toast } from './components/common/Toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import Organizations from './pages/Organizations';
import AddCompany from './pages/AddCompany';
import Agreements from './pages/Agreements';
import AddAgreement from './pages/AddAgreement';
import Attendances from './pages/Attendances';
import Leaves from './pages/Leaves';
import Settings from './pages/Settings';
import LeaveTypeManagement from './pages/LeaveTypeManagement';
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/add-employee" element={<AddEmployee />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/organizations/add-company" element={<AddCompany />} />
        <Route path="/agreements" element={<Agreements />} />
        <Route path="/agreements/add-agreement" element={<AddAgreement />} />
        <Route path="/attendances" element={<Attendances />} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/leaves/leave-types" element={<LeaveTypeManagement />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <Toast />
    </>
  );
}

export default App;