import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app and provides authentication + role state.
 *
 * Exposes:
 *   user       — user profile object (or null)
 *   role       — 'staff' | 'user' | null
 *   loading    — true while auth state is being determined
 *   loginWithCredentials(username, password) — login via backend
 *   registerWithCredentials(data)            — register via backend
 *   logout()                                 — clears token and state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

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
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── On mount: check for existing session ──
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // ── Username/Password Login ──
  // selectedRole is used as a fallback when backend doesn't return a role
  const loginWithCredentials = async (username, password, selectedRole = 'user') => {
    try {
      const res = await api.post('/auth/login', { username, password });
      const { token, user: userData, ...rest } = res.data;
      const profile = userData || rest;
      localStorage.setItem('accessToken', token);
      // Use backend role if present, otherwise fall back to user's selection
      const resolvedRole = profile?.role || selectedRole;
      const enrichedProfile = { ...profile, role: resolvedRole };
      setUser(enrichedProfile);
      setRole(resolvedRole);
      return enrichedProfile;
    } catch (error) {
      console.error('Login error:', error.response?.status, error.response?.data);
      throw error;
    }
  };

  // ── Registration ──
  const registerWithCredentials = async (registrationData) => {
    try {
      const { role: selectedRole, ...payload } = registrationData;
      const endpoint =
        selectedRole === 'staff' ? '/auth/register/staff' : '/auth/register/user';

      const body = { ...payload, role: selectedRole };
      console.log('Registration request:', endpoint, JSON.stringify(body, null, 2));

      const res = await api.post(endpoint, body);
      console.log('Registration response:', res.status, res.data);

      // If backend returns a token directly, use it
      if (res.data?.token) {
        localStorage.setItem('accessToken', res.data.token);
        const userData = res.data.user || { username: payload.username, role: selectedRole };
        setUser(userData);
        setRole(userData.role || selectedRole);
        return userData;
      }

      // If backend only returns success, auto-login
      if (res.data?.success || res.status === 200) {
        try {
          const loginRes = await api.post('/auth/login', {
            username: payload.username,
            password: payload.password,
          });
          if (loginRes.data?.token) {
            localStorage.setItem('accessToken', loginRes.data.token);
            const userData = loginRes.data.user || { username: payload.username, role: selectedRole };
            setUser(userData);
            setRole(userData.role || selectedRole);
            return userData;
          }
          setUser({ username: payload.username, role: selectedRole });
          setRole(selectedRole);
          return { username: payload.username, role: selectedRole };
        } catch (loginErr) {
          console.warn('Auto-login after registration failed:', loginErr);
          setUser({ username: payload.username, role: selectedRole });
          setRole(selectedRole);
          return { username: payload.username, role: selectedRole };
        }
      }

      return res.data;
    } catch (error) {
      console.error('Registration error:', error.response?.status, error.response?.data);
      if (!error.response) {
        error.message = `Cannot reach the server. Make sure your backend allows requests from ${window.location.origin}`;
      }
      throw error;
    }
  };

  // ── Sign out ──
  const logout = async () => {
    try {
      await api.post('/auth/logout').catch(() => {});
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      setRole(null);
    }
  };

  const value = {
    user,
    role,
    loading,
    loginWithCredentials,
    registerWithCredentials,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context from any component.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
