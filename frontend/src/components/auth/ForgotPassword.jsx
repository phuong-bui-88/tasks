import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Alert, Paper } from '@mui/material';
import { authService } from '../../services/authService';
import { validateEmail } from '../../utils/validation';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            await authService.forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process your request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Forgot Password
                </Typography>

                {success ? (
                    <Box>
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Password reset link has been sent to your email address.
                        </Alert>
                        <Typography paragraph>
                            Please check your inbox and follow the instructions to reset your password.
                        </Typography>
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                <Button variant="contained" color="primary">
                                    Return to Login
                                </Button>
                            </Link>
                        </Box>
                    </Box>
                ) : (
                    <>
                        <Typography paragraph>
                            Enter your email address and we'll send you a link to reset your password.
                        </Typography>

                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={handleChange}
                                error={!!error}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Send Reset Link'}
                            </Button>

                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Link to="/login" style={{ textDecoration: 'none' }}>
                                    <Typography variant="body2" color="primary">
                                        Back to Login
                                    </Typography>
                                </Link>
                            </Box>
                        </Box>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default ForgotPassword;
