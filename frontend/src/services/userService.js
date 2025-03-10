import apiClient from './apiClient';
import authService from './authService';

const USER_ENDPOINT = 'users/';

class UserService {
    async updateUserProfile(userId, userData) {
        try {
            const response = await apiClient.put(`${USER_ENDPOINT}${userId}`, userData);

            // Update local storage with new user data if available
            if (response.data) {
                const currentUser = authService.getCurrentUser() || {};
                const updatedUser = {
                    ...currentUser,
                    ...response.data
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            return response.data;
        } catch (error) {
            // The apiClient already formats errors, so we can just throw
            throw error;
        }
    }
}

export default new UserService();
