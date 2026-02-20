import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import LoginPage from './features/auth/LoginPage';
import StaffDashboard from './features/staff/StaffDashboard';
import UserHome from './features/user/UserHome';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected: Staff Dashboard */}
      <Route
        path="/staff-dashboard"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected: User Home */}
      <Route
        path="/user-home"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserHome />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
