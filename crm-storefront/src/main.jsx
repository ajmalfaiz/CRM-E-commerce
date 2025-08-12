import axios from 'axios';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Dynamically attach JWT token to every request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Also set default header at startup if a token already exists
const existingToken = localStorage.getItem('token');
if (existingToken) {
  axios.defaults.headers.common.Authorization = `Bearer ${existingToken}`;
}

// Global response interceptor: if token is invalid/expired, force re-login
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.error || '';
    if ((status === 401 || status === 403) && (message.includes('Invalid token') || message.includes('Missing token'))) {
      localStorage.removeItem('token');
      // Avoid infinite loops if already on login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
