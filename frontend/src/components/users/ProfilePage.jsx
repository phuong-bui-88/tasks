import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import userService from '../../services/userService';
// Removed CSS import since we're using Tailwind now

function ProfilePage() {
    const { userData, updateUserProfile } = useUser();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Load user data when component mounts
    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            username: userData.username || '',
            email: userData.email || '',
            password: ''
        }));
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        // Clear message when user starts typing
        if (message.text) {
            setMessage({ text: '', type: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        try {
            // Prepare data for update - only include changed fields
            const updatedData = {};
            if (formData.username !== userData.username) {
                updatedData.username = formData.username;
            }
            if (formData.email !== userData.email) {
                updatedData.email = formData.email;
            }
            if (formData.password) {
                updatedData.password = formData.password;
            }

            // Only proceed if there are changes
            if (Object.keys(updatedData).length > 0) {
                // Call the service to update the profile
                const result = await userService.updateUserProfile(userData.id, updatedData);

                // Update the app state with the new user data
                updateUserProfile(result);

                // Show success message
                setMessage({
                    text: 'Profile updated successfully',
                    type: 'success'
                });

                // Clear password field after successful update
                setFormData(prev => ({ ...prev, password: '' }));
            } else {
                setMessage({ text: 'No changes detected', type: 'info' });
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setMessage({
                text: error.userMessage || 'Failed to update profile. Please try again.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getMessageClasses = () => {
        const baseClasses = "mb-4 p-3 rounded-md text-sm font-medium";

        switch (message.type) {
            case 'success':
                return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
            case 'error':
                return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
            case 'info':
                return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
        }
    };

    return (
        <div className="py-8 px-4 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Profile Settings</h2>

                {message.text && (
                    <div className={getMessageClasses()}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200 border-b border-gray-200 pb-2">Personal Information</h3>

                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200 border-b border-gray-200 pb-2">Change Password</h3>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">New Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Leave blank if you don't want to change password</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                            onClick={() => navigate('/')}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProfilePage;
