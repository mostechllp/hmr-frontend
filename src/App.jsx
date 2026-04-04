import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import { useSelector } from 'react-redux';
import { useTheme } from "./hooks/useTheme";
import RouteChangeLoader from "./components/common/RouteChangeLoader";
import AddOrganization from "./pages/AddOrganization";

// Lazy load pages for better performance
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Employees = lazy(() => import("./pages/Employees"));
const AddEmployee = lazy(() => import("./pages/AddEmployee"));
const Organizations = lazy(() => import("./pages/Organizations"));
const AddCompany = lazy(() => import("./pages/AddCompany"));
const Agreements = lazy(() => import("./pages/Agreements"));
const AddAgreement = lazy(() => import("./pages/AddAgreement"));
const Attendances = lazy(() => import("./pages/Attendances"));
const Leaves = lazy(() => import("./pages/Leaves"));
const LeaveTypeManagement = lazy(() => import("./pages/LeaveTypeManagement"));
// const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import("./pages/Settings"));

// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useSelector((state) => state.auth);

//   if (loading) {
//     return <Loader fullScreen />;
//   }

//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
      <RouteChangeLoader>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              // <PrivateRoute>
              <Dashboard />
              // </PrivateRoute>
            }
          />
          <Route
            path="/employees"
            element={
              // <PrivateRoute>
              <Employees />
              // </PrivateRoute>
            }
          />
          <Route
            path="/employees/add-employee"
            element={
              // <PrivateRoute>
              <AddEmployee />
              // </PrivateRoute>
            }
          />
          <Route
            path="/organizations"
            element={
              // <PrivateRoute>
              <Organizations />
              // </PrivateRoute>
            }
          />
          <Route
            path="/organizations/add-organization"
            element={
              // <PrivateRoute>
              <AddOrganization />
              // </PrivateRoute>
            }
          />
          <Route
            path="/organizations/add-company"
            element={
              // <PrivateRoute>
              <AddCompany />
              // </PrivateRoute>
            }
          />
          <Route
            path="/agreements"
            element={
              // <PrivateRoute>
              <Agreements />
              // </PrivateRoute>
            }
          />
          <Route
            path="/agreements/add-agreement"
            element={
              // <PrivateRoute>
              <AddAgreement />
              // </PrivateRoute>
            }
          />
          <Route
            path="/attendances"
            element={
              // <PrivateRoute>
              <Attendances />
              // </PrivateRoute>
            }
          />
          <Route
            path="/leaves"
            element={
              // <PrivateRoute>
              <Leaves />
              // </PrivateRoute>
            }
          />
          <Route
            path="/leaves/leave-types"
            element={
              // <PrivateRoute>
              <LeaveTypeManagement />
              // </PrivateRoute>
            }
          />
          {/* <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        /> */}
          <Route
            path="/settings"
            element={
              // <PrivateRoute>
              <Settings />
              // </PrivateRoute>
            }
          />
        </Routes>
      </RouteChangeLoader>
  );
}

export default App;
