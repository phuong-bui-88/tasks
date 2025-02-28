import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Service for handling authentication-related API calls
 */
export const authService = {
  /**
   * Log in a user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} - Promise with user data and token
   */
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      if (response.data && response.data.token) {
        // Store token in local storage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise with registration result
   */
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Send password reset link to user's email
   * @param {string} email - User's email
   * @returns {Promise} - Promise with request result
   */
  async forgotPassword(email) {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  /**
   * Reset user's password with token
   * @param {string} token - Reset token from email
   * @param {string} password - New password
   * @returns {Promise} - Promise with reset result
   */
  async resetPassword(token, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, { 
        token, 
        password
      });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  /**
   * Log out current user
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current authenticated user
   * @returns {Object|null} - User object or null if not logged in
   */
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user is logged in
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  /**
   * Get authentication token
   * @returns {string|null} - Auth token or null
   */
  getToken() {
    return localStorage.getItem('token');
  }
};

// Add an axios interceptor to include the auth token in all requests
axios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 Unauthorized errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Automatically logout on 401 responses
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default authService;
