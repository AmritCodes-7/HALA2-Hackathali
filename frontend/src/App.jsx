import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import RoleSelection from './pages/RoleSelection';
import ProOnboarding from './pages/ProOnboarding';
import CustomerDashboard from './pages/CustomerDashboard';
import ProDashboard from './pages/ProDashboard';

/**
 * Dashboard Switcher — renders the correct dashboard based on the user's role.
 */
function DashboardSwitcher() {
  const { role } = useAuth();

  if (role === 'pro') return <ProDashboard />;
  if (role === 'customer') return <CustomerDashboard />;

  // Fallback (shouldn't reach here due to ProtectedRoute)
  return <Navigate to="/role-selection" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Auth-only, no role required */}
      <Route
        path="/role-selection"
        element={
          <ProtectedRoute requireRole={false}>
            <RoleSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/pro"
        element={
          <ProtectedRoute requireRole={false}>
            <ProOnboarding />
          </ProtectedRoute>
        }
      />

      {/* Auth + Role required */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requireRole={true}>
            <DashboardSwitcher />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
