import React, { useEffect, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';

// This is a modified UserForm that removes fullName fields
const UserForm = ({ initialValues = {}, onSubmit, buttonText = 'Submit', isEditing = false }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'ROLE_USER',
        ...initialValues
    });

    const [validated, setValidated] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setFormData({
            username: initialValues.username || '',
            email: initialValues.email || '',
            password: '',  // Don't populate password for security
            role: initialValues.role || 'ROLE_USER',
            ...initialValues
        });
    }, [initialValues]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            await onSubmit(formData);
            form.reset();
            setValidated(false);
        } catch (err) {
            setError(err.message || 'An error occurred while submitting the form');
        }
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    required
                    type="text"
                    placeholder="Enter username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a username.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    required
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                </Form.Control.Feedback>
            </Form.Group>

            {!isEditing && (
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required={!isEditing}
                        type="password"
                        placeholder="Enter password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={6}
                    />
                    <Form.Control.Feedback type="invalid">
                        Password must be at least 6 characters.
                    </Form.Control.Feedback>
                </Form.Group>
            )}

            {isEditing && (
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password (leave blank to keep current)</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter new password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={6}
                    />
                    <Form.Control.Feedback type="invalid">
                        Password must be at least 6 characters.
                    </Form.Control.Feedback>
                </Form.Group>
            )}

            <Form.Group className="mb-3" controlId="role">
                <Form.Label>Role</Form.Label>
                <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="ROLE_USER">User</option>
                    <option value="ROLE_MANAGER">Manager</option>
                    <option value="ROLE_ADMIN">Admin</option>
                </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
                {buttonText}
            </Button>
        </Form>
    );
};

export default UserForm;
