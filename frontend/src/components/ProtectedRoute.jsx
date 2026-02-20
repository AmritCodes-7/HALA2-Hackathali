import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — guards routes behind authentication + optional role checks.
 *
 * Props:
 *   children     — the page to render if checks pass
 *   allowedRoles — array of roles that can access this route, e.g. ['staff', 'user']
 *
 * Redirect logic:
 *   1. Not authenticated → /login
 *   2. Has role but not in allowedRoles → redirect to correct dashboard
 *   3. All good → render children
 */
export default function ProtectedRoute({ children, allowedRoles = null }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role doesn't match allowed list — redirect to correct dashboard
  if (allowedRoles && !allowedRoles.includes(role)) {
    const redirect = role === 'staff' ? '/staff-dashboard' : '/user-home';
    return <Navigate to={redirect} replace />;
  }

  return children;
}
