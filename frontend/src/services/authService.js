import apiClient from './apiClient';

const AUTH_ENDPOINT = 'auth/';

class AuthService {
  async login(username, password) {
    try {
      const response = await apiClient.post(AUTH_ENDPOINT + 'login', {
        username,
        password
      });

      // Save auth data in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
      }

      return response.data;
    } catch (error) {
      // The apiClient already formats errors, so we can just throw
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await apiClient.post(`${AUTH_ENDPOINT}register`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    // Call backend logout endpoint (ignore errors for robustness)
    try {
      await apiClient.post(AUTH_ENDPOINT + 'logout');
    } catch (e) {
      // Ignore errors (e.g., network/server down)
    }
    // Clear all auth/session data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    sessionStorage.clear();
    // Optionally clear cookies if used
    // Broadcast logout to other tabs
    window.localStorage.setItem('logout-event', Date.now().toString());
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getAuthToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getAuthToken();
  }
}

export default new AuthService();
