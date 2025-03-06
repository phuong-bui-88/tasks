import axios from 'axios';

// Get the API URL from environment variables with fallback
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/api';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error statuses
    if (error.response) {
      // Unauthorized - clear auth and redirect
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Only redirect to login if we're not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      // Format error message for client use
      const errorMessage = error.response.data?.message || 'An error occurred';
      error.userMessage = errorMessage;
    } else if (error.request) {
      // Request was made but no response received
      error.userMessage = 'No response from server. Please check your connection.';
    } else {
      // Something happened in setting up the request
      error.userMessage = error.message || 'An unexpected error occurred';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
