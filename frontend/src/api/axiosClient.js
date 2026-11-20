import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pulseflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for automatic error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected routes, wipe token if expired
      if (window.location.pathname.startsWith('/dashboard') ||
          window.location.pathname.startsWith('/projects') ||
          window.location.pathname.startsWith('/analytics') ||
          window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('pulseflow_token');
        localStorage.removeItem('pulseflow_user');
        window.location.href = '/login?session_expired=1';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
