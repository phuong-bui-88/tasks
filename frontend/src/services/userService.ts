import axios from 'axios';
import { User, UserFormData } from '../types/User';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/api';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  createUser: async (userData: UserFormData): Promise<User> => {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  },

  updateUser: async (id: number, userData: UserFormData): Promise<User> => {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/users/${id}`);
  }
};
