import { Alert, Box, Button, Container, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { validateEmail, validatePassword } from '../../utils/validation';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear field-specific error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

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
            // Updated to match the API request format
            const response = await authService.register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            // Store the token and user data in localStorage
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify({
                    userId: response.userId,
                    username: response.username,
                    email: response.email,
                    roles: response.roles
                }));

                // Redirect to dashboard instead of login page
                navigate('/dashboard');
            } else {
                // If no token in response, show error
                setServerError('Registration successful but authentication failed. Please try logging in.');
                navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
            }
        } catch (err) {
            setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Create an Account
                </Typography>

                {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={formData.username}
                        onChange={handleChange}
                        error={!!errors.username}
                        helperText={errors.username}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
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
                        label="Confirm Password"
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
                        {loading ? 'Registering...' : 'Register'}
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <Typography variant="body2" color="primary">
                                Already have an account? Log in
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;
