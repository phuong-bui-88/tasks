// Application configuration file

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Auth Configuration
export const AUTH_CONFIG = {
  tokenExpiryMinutes: 60,
  refreshThresholdMinutes: 5,
};

// Feature Flags
export const FEATURES = {
  enableDarkMode: true,
  enableNotifications: true,
  enableTaskReminders: true,
};

// Route Configuration
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  TASKS: '/tasks',
  TASK_DETAIL: '/tasks/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};
