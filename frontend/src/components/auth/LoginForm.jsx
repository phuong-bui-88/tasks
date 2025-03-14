import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Simulate login - replace with actual API call
            await onLogin(formData);
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to continue to your account</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-center text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-lg">✉️</span>
                        </div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="pl-10 w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="your@email.com"
                        />
                    </div>
                </div>

                <div className="mb-5">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-lg">🔒</span>
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="pl-10 w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="text-right mb-4">
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-md shadow transition-all duration-200 flex justify-center items-center disabled:opacity-70"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                        </>
                    ) : 'Sign In'}
                </button>

                <div className="mt-6 text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-800 hover:underline">
                        Create Account
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
