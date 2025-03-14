import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import registerWithAutoLogin from '../../services/authService';
// Removed CSS import since we're using Tailwind now

function RegisterPage({ onRegister, onCancel, error }) {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [registrationError, setRegistrationError] = useState('');

    // Add navigate hook for redirection
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!userData.username.trim()) {
            errors.username = 'Username is required';
        }

        if (!userData.password) {
            errors.password = 'Password is required';
        } else if (userData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (userData.password !== userData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!userData.email.includes('@')) {
            errors.email = 'Valid email is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:');

        if (validateForm()) {
            setIsLoading(true);
            setRegistrationError('');

            try {
                // Remove confirmPassword before sending to backend
                const { confirmPassword, ...registrationData } = userData;

                // Use the new service to register and auto-login
                const result = await registerWithAutoLogin.register(registrationData);

                if (result.success) {
                    // Registration and auto-login successful
                    // Notify parent component if needed
                    if (onRegister) {
                        onRegister(result);
                    }

                    // Redirect to tasks page
                    navigate('/tasks');
                } else {
                    // Handle registration failure
                    setRegistrationError(result.error || 'Registration failed. Please try again.');
                }
            } catch (error) {
                setRegistrationError(error.message || 'Registration failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Please fill in your details</p>
                    </div>

                    {(error || registrationError) && (
                        <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-sm">
                            {error || registrationError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={userData.email}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                />
                            </div>
                            {validationErrors.email && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Username"
                                    value={userData.username}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                />
                            </div>
                            {validationErrors.username && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.username}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    value={userData.password}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                />
                            </div>
                            {validationErrors.password && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={userData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="pl-10 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                />
                            </div>
                            {validationErrors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.confirmPassword}</p>
                            )}
                        </div>

                        <div className="mt-8 space-y-3">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:bg-indigo-400"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>

                            <button
                                type="button"
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                Back to Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
