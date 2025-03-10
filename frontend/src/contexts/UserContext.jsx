import React, { createContext, useContext, useEffect, useState } from 'react';

// Create context
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({
        username: 'User',
        email: ''
    });

    // Load user data from localStorage on initial render
    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        if (loggedInStatus === 'true') {
            setIsLoggedIn(true);

            try {
                const storedUserData = localStorage.getItem('user');
                if (storedUserData) {
                    const user = JSON.parse(storedUserData);
                    setUserData({
                        username: user.username || 'User',
                        email: user.email || ''
                    });
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    // Handle login
    const handleLogin = (credentials) => {
        if (credentials.username && credentials.password) {
            setIsLoggedIn(true);
            setUserData(prev => ({
                ...prev,
                username: credentials.username
            }));

            // Store in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify({
                username: credentials.username,
                email: userData.email
            }));

            return true;
        }
        return false;
    };

    // Handle logout
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserData({
            username: 'User',
            email: ''
        });

        // Clear localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    // Update user profile
    const updateUserProfile = (updatedData) => {
        setUserData(prev => ({
            ...prev,
            username: updatedData.username || prev.username,
            email: updatedData.email !== undefined ? updatedData.email : prev.email
        }));

        // Update localStorage
        try {
            const storedUserData = JSON.parse(localStorage.getItem('user')) || {};
            const updatedUser = {
                ...storedUserData,
                username: updatedData.username || storedUserData.username || userData.username,
                email: updatedData.email !== undefined ? updatedData.email : storedUserData.email || userData.email
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    // Context value
    const value = {
        isLoggedIn,
        userData,
        handleLogin,        // Keep the original name too for backward compatibility
        handleLogout,
        updateUserProfile
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook for using the context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
};

export default UserContext;
