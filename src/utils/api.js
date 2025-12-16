/**
 * AXIOS INTERCEPTOR - Automatic Token Refresh
 * File: utils/api.js (or axiosInterceptor.js)
 * 
 * This intercepts all API requests and automatically refreshes expired tokens
 */

import axios from 'axios';
import { useUserStore } from '../stores/userStore';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// REQUEST INTERCEPTOR - Add token to every request
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useUserStore.getState();
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Auto-refresh on 401
api.interceptors.response.use(
  (response) => {
    // If response is successful, return it
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken, logout } = useUserStore.getState();

      if (!refreshToken) {
        // No refresh token, logout user
        logout();
        return Promise.reject(error);
      }

      try {
        // Call refresh endpoint
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        const newRefreshToken = response.data.refresh || refreshToken;

        // Update tokens in store
        useUserStore.setState({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry original request
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null);
        
        const { logout } = useUserStore.getState();
        logout();
        
        // Optionally redirect to login
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;