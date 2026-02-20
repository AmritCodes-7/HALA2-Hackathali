import axios from 'axios';
import { auth } from '../config/firebase';

/**
 * Global Axios instance with automatic Firebase token injection.
 *
 * Every outgoing request passes through the request interceptor which:
 * 1. Gets the currently signed-in Firebase user
 * 2. Calls getIdToken() to retrieve a fresh (auto-refreshed) ID token
 * 3. Attaches it as `Authorization: Bearer <token>` in the request headers
 *
 * Usage:
 *   import api from '@/api/axiosInstance';
 *   const res = await api.get('/some-endpoint');
 *   // Token is attached automatically — no manual work needed.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ────────────────────────────────────────────
// REQUEST INTERCEPTOR — Automatic Token Attachment
// ────────────────────────────────────────────
api.interceptors.request.use(
  async (config) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // getIdToken(true) would force-refresh; default (false) uses cached token
        // and only refreshes when the token is about to expire.
        const token = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error attaching auth token:', error);
      // Let the request proceed without a token — server will 401 if needed
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
        // Optionally redirect to login or trigger a re-auth flow
      }
      if (status === 403) {
        console.warn('Forbidden — user does not have the required permissions.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
