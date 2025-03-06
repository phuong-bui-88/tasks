import axios from 'axios';
import authService from '../services/authService';

// Add a request interceptor
axios.interceptors.request.use(
    (config) => {
        const token = authService.getAuthToken();
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If 401 Unauthorized response is returned, logout user and redirect to login
        if (error.response && error.response.status === 401) {
            // Check if the error is not from the login endpoint itself
            const isLoginRequest = error.config.url.includes('/api/auth/login');
            
            if (!isLoginRequest) {
                authService.logout();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axios;
