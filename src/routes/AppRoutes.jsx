import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import EmployeesList from '../pages/admin/EmployeesList';
import AdminAttendance from '../pages/admin/Attendance';
import AdminLeaves from '../pages/admin/Leaves';
import AdminPayroll from '../pages/admin/Payroll';
import AdminReports from '../pages/admin/Reports';

// Employee Pages
import EmployeeDashboard from '../pages/employee/Dashboard';
import EmployeeProfile from '../pages/employee/Profile';
import EmployeeAttendance from '../pages/employee/Attendance';
import EmployeeLeave from '../pages/employee/Leave';
import EmployeePayroll from '../pages/employee/Payroll';

// Common Pages
import Notifications from '../pages/Notifications';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Route>

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="employees" element={<EmployeesList />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="leaves" element={<AdminLeaves />} />
        <Route path="payroll" element={<AdminPayroll />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* Employee Routes */}
      <Route 
        path="/employee" 
        element={
          <ProtectedRoute allowedRoles={['employee', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="profile" element={<EmployeeProfile />} />
        <Route path="attendance" element={<EmployeeAttendance />} />
        <Route path="leave" element={<EmployeeLeave />} />
        <Route path="payroll" element={<EmployeePayroll />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="*" element={<Navigate to="/employee/dashboard" replace />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
