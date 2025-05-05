import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

// Create context
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({
        id: '',
        username: 'User',
        email: ''
    });

    // Function to get user data from localStorage and map it to userData format
    const getUserFromStorage = () => {
        try {
            const storedData = localStorage.getItem('user');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                return {
                    id: parsedData.id || parsedData.userId || '',
                    username: parsedData.username || 'User',
                    email: parsedData.email || '',
                    roles: parsedData.roles || []
                };
            }
        } catch (error) {
            console.error('Error retrieving user data:', error);
        }
        return { id: '', username: 'User', email: '', roles: [] };
    };

    // Load user data from localStorage on initial render
    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        if (loggedInStatus === 'true') {
            setIsLoggedIn(true);
            setUserData(getUserFromStorage());
        }
    }, []);

    // Handle login
    const handleLogin = (credentials) => {
        if (credentials.username && credentials.password) {
            const newUserData = {
                id: credentials.userId || credentials.id || '',
                username: credentials.username,
                email: credentials.email || '',
                roles: credentials.roles || []
            };

            setIsLoggedIn(true);
            setUserData(newUserData);

            // Note: The localStorage is already set in the Login component
            // We don't need to duplicate setting localStorage here

            return true;
        }
        return false;
    };

    // Handle logout
    const handleLogout = async () => {
        setIsLoggedIn(false);
        setUserData({
            id: '',
            username: 'User',
            email: ''
        });

        // Call improved logout (clears storage, backend, multi-tab)
        await authService.logout();
    };

    // Update user profile
    const updateUserProfile = (updatedData) => {
        const newUserData = {
            ...userData,
            id: updatedData.id || updatedData.userId || userData.id,
            username: updatedData.username || userData.username,
            email: updatedData.email !== undefined ? updatedData.email : userData.email
        };

        setUserData(newUserData);

        // Update localStorage
        try {
            localStorage.setItem('user', JSON.stringify(newUserData));
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    // Listen for logout in other tabs
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === 'logout-event') {
                setIsLoggedIn(false);
                setUserData({ id: '', username: 'User', email: '' });
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    // Context value
    const value = {
        isLoggedIn,
        userData,
        handleLogin,
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
