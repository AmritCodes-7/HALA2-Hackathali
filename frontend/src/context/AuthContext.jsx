import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axiosInstance';

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app and provides authentication + role state.
 *
 * Authentication flow (Spring Boot backend OAuth):
 * 1. User clicks "Continue with Google" → redirects to Spring Boot's OAuth endpoint
 * 2. Spring Boot handles OAuth with Google, creates/finds user, generates JWT
 * 3. Spring Boot redirects back to frontend with JWT token as a query param
 * 4. Frontend stores JWT in localStorage and fetches user profile from backend
 *
 * Exposes:
 *   user       — user profile object (or null)
 *   role       — 'customer' | 'pro' | null
 *   loading    — true while auth state is being determined
 *   signInWithGoogle()   — redirects to backend OAuth endpoint
 *   loginWithCredentials(email, password) — email/password login via backend
 *   registerWithCredentials(name, email, password) — register via backend
 *   logout()             — clears token and user state
 *   updateRole(newRole, additionalData) — sets role via backend API
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

  // ── Fetch current user profile from backend ──
  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      const res = await api.get('/auth/me');
      const userData = res.data;
      setUser(userData);
      setRole(userData.role || null);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Token is invalid or expired
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── On mount: check for OAuth callback token or existing session ──
  useEffect(() => {
    // Check if we're returning from OAuth callback with a token in URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // Store the token from OAuth callback
      localStorage.setItem('accessToken', token);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Fetch user profile (either from stored token or newly received OAuth token)
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // ── Google OAuth sign‑in (redirect to Spring Boot) ──
  const signInWithGoogle = () => {
    // Redirect to Spring Boot's OAuth2 authorization endpoint
    // After successful auth, Spring Boot will redirect back to:
    // FRONTEND_URL/login?token=<jwt_token>
    window.location.href = `${BACKEND_URL}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(window.location.origin + '/login')}`;
  };

  // ── Email/Password Login ──
  const loginWithCredentials = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('accessToken', token);
      setUser(userData);
      setRole(userData.role || null);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // ── Email/Password Registration ──
  // Routes to /register/user or /register/staff based on the role field
  const registerWithCredentials = async (registrationData) => {
    try {
      const { role: selectedRole, ...fields } = registrationData;
      const endpoint =
        selectedRole === 'staff' ? '/register/staff' : '/register/user';

      const res = await api.post(endpoint, { ...fields, role: selectedRole });
      const { token, user: userData } = res.data;
      localStorage.setItem('accessToken', token);
      setUser(userData);
      setRole(userData.role || null);
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // ── Sign out ──
  const logout = async () => {
    try {
      // Optionally notify backend
      await api.post('/auth/logout').catch(() => {});
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      setRole(null);
    }
  };

  // ── Update role via backend API ──
  const updateRole = async (newRole, additionalData = {}) => {
    if (!user) return;
    try {
      const res = await api.put('/auth/role', {
        role: newRole,
        ...additionalData,
      });
      const updatedUser = res.data;
      setUser(updatedUser);
      setRole(newRole);
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  };

  const value = {
    user,
    role,
    loading,
    signInWithGoogle,
    loginWithCredentials,
    registerWithCredentials,
    logout,
    updateRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context from any component.
 * Usage: const { user, role, signInWithGoogle } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
