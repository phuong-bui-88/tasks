import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Alert, Paper } from '@mui/material';
import { authService } from '../../services/authService';
import { validatePassword } from '../../utils/validation';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [token, setToken] = useState('');
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Extract token from URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const tokenParam = searchParams.get('token');

        if (!tokenParam) {
            setServerError('Invalid or missing reset token. Please request a new password reset link.');
        } else {
            setToken(tokenParam);
        }
    }, [location.search]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters with letters, numbers, and special characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(token, formData.password);
            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login', { state: { message: 'Password reset successful! Please log in with your new password.' } });
            }, 3000);
        } catch (err) {
            setServerError(err.response?.data?.message || 'Password reset failed. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    if (!token && !serverError) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Reset Password
                </Typography>

                {serverError && (
                    <>
                        <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                                <Button variant="contained" color="primary">
                                    Request New Reset Link
                                </Button>
                            </Link>
                        </Box>
                    </>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Password has been reset successfully! Redirecting to login page...
                    </Alert>
                )}

                {!serverError && !success && (
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="New Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm New Password"
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default ResetPassword;
