import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';

/**
 * Layout component for authentication pages
 */
const AuthLayout = ({ children, title }) => {
    const location = useLocation();
    const message = location.state?.message;

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        {title}
                    </Typography>

                    {message && (
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 2,
                                backgroundColor: 'success.light',
                                p: 1,
                                borderRadius: 1,
                                color: 'white'
                            }}
                        >
                            {message}
                        </Typography>
                    )}

                    {children}
                </Paper>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 4 }}
                >
                    Task Management System © {new Date().getFullYear()}
                </Typography>
            </Box>
        </Container>
    );
};

export default AuthLayout;
