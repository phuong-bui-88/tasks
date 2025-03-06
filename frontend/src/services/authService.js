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
      const response = await apiClient.post(AUTH_ENDPOINT + 'register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  }

  getAuthToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getAuthToken();
  }
}

export default new AuthService();
