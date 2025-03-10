import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import userService from '../../services/userService';
import './ProfilePage.css';

function ProfilePage() {
    const { userData, updateUserProfile } = useUser();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Load user data when component mounts
    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            username: userData.username || '',
            email: userData.email || '',
            password: ''
        }));
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        // Clear message when user starts typing
        if (message.text) {
            setMessage({ text: '', type: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        try {
            // Prepare data for update - only include changed fields
            const updatedData = {};
            if (formData.username !== userData.username) {
                updatedData.username = formData.username;
            }
            if (formData.email !== userData.email) {
                updatedData.email = formData.email;
            }
            if (formData.password) {
                updatedData.password = formData.password;
            }

            // Only proceed if there are changes
            if (Object.keys(updatedData).length > 0) {
                // Call the service to update the profile
                const result = await userService.updateUserProfile(userData.id, updatedData);

                // Update the app state with the new user data
                updateUserProfile(result);

                // Show success message
                setMessage({
                    text: 'Profile updated successfully',
                    type: 'success'
                });

                // Clear password field after successful update
                setFormData(prev => ({ ...prev, password: '' }));
            } else {
                setMessage({ text: 'No changes detected', type: 'info' });
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setMessage({
                text: error.userMessage || 'Failed to update profile. Please try again.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <h2>Profile Settings</h2>

                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>Personal Information</h3>

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Change Password</h3>

                        <div className="form-group">
                            <label htmlFor="password">New Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                disabled={isLoading}
                            />
                            <small className="password-hint">Leave blank if you don't want to change password</small>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate('/')}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProfilePage;
