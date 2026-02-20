import axios from 'axios';

/**
 * Centralized Axios instance for all API calls.
 *
 * Base URL is constructed from env: VITE_API_BASE_URL + /api/v1
 * Every request automatically attaches the JWT token from localStorage.
 */
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── REQUEST INTERCEPTOR — Automatic Token Attachment ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── RESPONSE INTERCEPTOR — Global Error Handling ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      const url = error.config?.url || '';
      const isAuthRequest = url.includes('/auth/');

      if (status === 401 && !isAuthRequest) {
        console.warn('Unauthorized — token may have expired.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      if (status === 403) {
        console.warn('Forbidden — insufficient permissions.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
