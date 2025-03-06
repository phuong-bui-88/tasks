import { API_BASE_URL } from '../config';
import { getToken } from '../services/authService';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  return response.json();
};

// Get headers with authentication token if available
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Register a new user
export const registerUser = async (userData) => {
  // This function is now just a wrapper around the service function
  // We'll import and use the authService instead
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  return handleResponse(response);
};

// Get tasks for the current user
export const getTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    headers: getHeaders(),
  });
  
  return handleResponse(response);
};

// Create a new task
export const createTask = async (taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(taskData),
  });
  
  return handleResponse(response);
};

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(taskData),
  });
  
  return handleResponse(response);
};

// Delete a task
export const deleteTask = async (taskId) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete task: ${response.status}`);
  }
  
  return true;
};
