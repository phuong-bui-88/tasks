import { useState } from 'react';
import { registerUser } from '../utils/api';
import './RegisterPage.css';

function RegisterPage({ onRegister, onCancel, error }) {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        fullName: ''
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [registrationError, setRegistrationError] = useState('');

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

        if (validateForm()) {
            setIsLoading(true);
            setRegistrationError('');

            try {
                // Remove confirmPassword before sending to backend
                const { confirmPassword, ...registrationData } = userData;

                // Call the API to register user
                const result = await registerUser(registrationData);

                // Call parent component's onRegister with the result
                onRegister(result);
            } catch (error) {
                setRegistrationError(error.message || 'Registration failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <div className="register-header">
                    <h2>Create Account</h2>
                    <p>Please fill in your details</p>
                </div>

                {(error || registrationError) && (
                    <div className="error-message">{error || registrationError}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <div className="input-icon-wrapper">
                            <i className="icon icon-user"></i>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                placeholder="Full Name"
                                value={userData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {validationErrors.fullName && (
                            <div className="validation-error">{validationErrors.fullName}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-icon-wrapper">
                            <i className="icon icon-email"></i>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email Address"
                                value={userData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {validationErrors.email && (
                            <div className="validation-error">{validationErrors.email}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-icon-wrapper">
                            <i className="icon icon-user"></i>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Username"
                                value={userData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {validationErrors.username && (
                            <div className="validation-error">{validationErrors.username}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-icon-wrapper">
                            <i className="icon icon-lock"></i>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                value={userData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {validationErrors.password && (
                            <div className="validation-error">{validationErrors.password}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-icon-wrapper">
                            <i className="icon icon-lock"></i>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={userData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {validationErrors.confirmPassword && (
                            <div className="validation-error">{validationErrors.confirmPassword}</div>
                        )}
                    </div>

                    <div className="form-footer">
                        <button
                            type="submit"
                            className="register-submit-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
