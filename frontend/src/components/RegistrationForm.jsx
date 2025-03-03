import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [validated, setValidated] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        // Form validation
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        // Password matching validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setValidated(true);
        setLoading(true);
        setError('');

        try {
            // Remove confirmPassword from sent data
            const { confirmPassword, ...registrationData } = formData;

            const response = await registerUser(registrationData);

            if (response.success) {
                // Store user token in localStorage or context
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify({
                    id: response.userId,
                    username: response.username,
                    email: response.email,
                    roles: response.roles
                }));

                navigate('/dashboard');
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Header as="h4" className="text-center">Register</Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Choose a username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a username.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        required
                                        type="email"
                                        placeholder="Enter your email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid email.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        required
                                        type="password"
                                        placeholder="Choose a password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        minLength={6}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Password must be at least 6 characters long.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="confirmPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        required
                                        type="password"
                                        placeholder="Confirm your password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please confirm your password.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <div className="d-grid gap-2 mt-4">
                                    <Button variant="primary" type="submit" disabled={loading}>
                                        {loading ? 'Registering...' : 'Register'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                        <Card.Footer className="text-center">
                            Already have an account? <Link to="/login">Login</Link>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegistrationForm;
