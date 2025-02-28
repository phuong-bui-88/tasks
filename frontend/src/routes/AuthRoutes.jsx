import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import { authService } from '../services/authService';

/**
 * Protected route component for authenticated users
 */
export const ProtectedRoute = ({ component: Component, ...rest }) => {
    const isAuthenticated = authService.isAuthenticated();

    return isAuthenticated ? (
        <Component {...rest} />
    ) : (
        <Navigate to="/login" state={{ message: 'Please login to access this page' }} />
    );
};

/**
 * Public route component - redirects to dashboard if user is already authenticated
 */
export const PublicRoute = ({ component: Component, restricted = false, ...rest }) => {
    const isAuthenticated = authService.isAuthenticated();

    return isAuthenticated && restricted ? (
        <Navigate to="/dashboard" />
    ) : (
        <Component {...rest} />
    );
};

/**
 * Authentication route definitions
 */
export const authRoutes = [
    <Route
        path="/login"
        element={<PublicRoute component={Login} restricted={true} />}
        key="login"
    />,
    <Route
        path="/register"
        element={<PublicRoute component={Register} restricted={true} />}
        key="register"
    />,
    <Route
        path="/forgot-password"
        element={<PublicRoute component={ForgotPassword} restricted={true} />}
        key="forgot-password"
    />,
    <Route
        path="/reset-password"
        element={<PublicRoute component={ResetPassword} restricted={true} />}
        key="reset-password"
    />,
];
