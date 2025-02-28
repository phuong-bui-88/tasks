import { Alert, Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to log in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Log In
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
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </Button>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                            <Typography variant="body2" color="primary">
                                Forgot password?
                            </Typography>
                        </Link>
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            <Typography variant="body2" color="primary">
                                Don't have an account? Sign Up
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
