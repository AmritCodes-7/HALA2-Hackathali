import axios from 'axios';

/**
 * Global Axios instance with automatic JWT token injection.
 *
 * Every outgoing request passes through the request interceptor which:
 * 1. Reads the JWT token from localStorage
 * 2. Attaches it as `Authorization: Bearer <token>` in the request headers
 *
 * Usage:
 *   import api from './api/axiosInstance';
 *   const res = await api.get('/some-endpoint');
 *   // Token is attached automatically — no manual work needed.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ────────────────────────────────────────────
// REQUEST INTERCEPTOR — Automatic Token Attachment
// ────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ────────────────────────────────────────────
// RESPONSE INTERCEPTOR — Global Error Handling
// ────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.warn('Unauthorized — token may have expired or user is logged out.');
        // Clear stale token and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      if (status === 403) {
        console.warn('Forbidden — user does not have the required permissions.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
