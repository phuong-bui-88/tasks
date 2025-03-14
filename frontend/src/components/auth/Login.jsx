import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import authService from '../../services/authService';

function Login() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { handleLogin } = useUser();  // Use the login function from UserContext

    // Check if there was a success message passed from registration
    const successMessage = location.state?.message;

    // Clear success message after 5 seconds
    useEffect(() => {
        let timer;
        if (successMessage) {
            timer = setTimeout(() => {
                // Clear the location state
                navigate(location.pathname, { replace: true });
            }, 5000);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [successMessage, navigate, location.pathname]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validate form inputs
        if (!credentials.username.trim()) {
            setError('Username or email is required');
            setIsLoading(false);
            return;
        }

        if (!credentials.password) {
            setError('Password is required');
            setIsLoading(false);
            return;
        }

        try {
            // Call the login method from authService
            const response = await authService.login(credentials.username, credentials.password);

            // Check if response contains required data
            if (!response || !response.token) {
                throw new Error('Invalid response from server');
            }

            // Store the JWT token in localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify({
                id: response.userId,
                username: response.username,
                email: response.email,
                roles: response.roles
            }));

            console.log('Login successful, updating auth state...');

            // Update the authentication state using context
            // Pass the response directly to handleLogin
            const success = handleLogin({
                userId: response.userId,
                username: response.username,
                password: credentials.password,
                email: response.email,
                roles: response.roles
            });

            if (success) {
                // Directly navigate to the dashboard after successful login
                navigate('/dashboard');
            } else {
                setError('Login failed. Please try again.');
            }

        } catch (error) {
            console.error('Login error:', error);
            // Handle specific error cases based on status codes
            if (error.response?.status === 401) {
                setError('Invalid username/password combination');
            } else if (error.response?.status === 423) {
                setError('Your account is locked due to too many failed attempts');
            } else {
                // Display user-friendly error message
                setError(error.userMessage || 'Login failed. Please check your credentials.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                    <p className="text-gray-600">Sign in to your account to continue</p>
                </div>

                {successMessage && (
                    <div className="mb-4 p-3 rounded bg-green-50 text-green-800 border border-green-200 text-center animate-fade-out">
                        {successMessage}
                    </div>
                )}

                {error && <div className="mb-4 p-3 rounded bg-red-50 text-red-800 border border-red-200 text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username or Email11</label>
                        <div className="relative">
                            <span className="absolute left-3 inset-y-0 flex items-center text-gray-500 pointer-events-none">👤</span>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Enter your username or email"
                                value={credentials.username}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                autoComplete="username"
                                className="pl-10 w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <span className="absolute left-3 inset-y-0 flex items-center text-gray-500 pointer-events-none">🔒</span>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                autoComplete="current-password"
                                className="pl-10 w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="text-right mb-4">
                        <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className={`w-full py-3 px-4 flex justify-center items-center text-white font-medium rounded-md shadow transition-all duration-200 
                            ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing In...
                                </span>
                            ) : 'Sign In'}
                        </button>

                        <div className="mt-6 text-center text-gray-600">
                            <span>Don't have an account?</span>{' '}
                            <Link to="/register" className="text-blue-600 hover:text-blue-800 hover:underline">
                                Register now
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
