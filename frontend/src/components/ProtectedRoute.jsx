import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — guards routes behind authentication + optional role checks.
 *
 * Props:
 *   children       — the page to render if checks pass
 *   requireRole    — if true, user must have a role assigned (default: true)
 *   allowedRoles   — array of roles that can access this route, e.g. ['customer', 'pro']
 *
 * Redirect logic:
 *   1. Not authenticated → /login
 *   2. Authenticated but no role (and requireRole is true) → /role-selection
 *   3. Has role but not in allowedRoles → /dashboard (unauthorized)
 *   4. All good → render children
 */
export default function ProtectedRoute({
  children,
  requireRole = true,
  allowedRoles = null,
}) {
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

  // 1. Not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Authenticated but no role assigned yet
  if (requireRole && !role) {
    return <Navigate to="/role-selection" replace />;
  }

  // 3. Role doesn't match allowed list
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. All checks passed
  return children;
}
