import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './Auth.css';

function Login({ setIsLoggedIn }) {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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
            localStorage.setItem('user', JSON.stringify({
                id: response.id,
                username: response.username,
                email: response.email,
                roles: response.roles
            }));

            console.log('Login successful, updating auth state...');

            // Update the authentication state in parent component
            setIsLoggedIn(true);

            // Directly navigate to the dashboard after successful login
            navigate('/dashboard');

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

    const goToDashboard = () => {
        console.log('Redirecting to dashboard...');
        navigate('/dashboard');
    };

    return (
        <div className="auth-container">
            <div className="auth-form login-form">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account to continue</p>
                    <button onClick={goToDashboard}>Go to Dashboard</button>
                </div>

                {successMessage && (
                    <div className="success-message">{successMessage}</div>
                )}

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username or Email</label>
                        <div className="input-icon-wrapper">
                            <span className="icon icon-email"></span>
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
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-icon-wrapper">
                            <span className="icon icon-lock"></span>
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
                            />
                        </div>
                    </div>

                    <div className="forgot-password">
                        <Link to="/forgot-password" className="text-button">Forgot password?</Link>
                    </div>

                    <div className="form-footer">
                        <button
                            type="submit"
                            className="auth-submit-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading-spinner">
                                    <span className="icon icon-spinner"></span>
                                    Signing In...
                                </span>
                            ) : 'Sign In'}
                        </button>

                        <div className="register-option">
                            <span>Don't have an account?</span>
                            <Link to="/register" className="text-button">Register now</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
