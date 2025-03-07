import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import UserProfileDropdown from './components/users/UserProfileDropdown';
import AppRoutes from './routes/AppRoutes';

function App() {
    const [tasks, setTasks] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('User');

    useEffect(() => {
        // Check if user is logged in (e.g., from localStorage)
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        if (loggedInStatus === 'true') {
            setIsLoggedIn(true);

            // Get username from localStorage
            try {
                const userData = localStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    if (user && user.username) {
                        setUserName(user.username);
                    }
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const handleLogin = (credentials) => {
        // Simple mock authentication
        if (credentials.username && credentials.password) {
            setIsLoggedIn(true);
            localStorage.setItem('isLoggedIn', 'true');
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
    };

    return (
        <BrowserRouter>
            <div className="app">
                <header className="app-header">
                    <h1>Task Management App</h1>
                    {isLoggedIn && <UserProfileDropdown handleLogout={handleLogout} userName={userName} userAvatar="path/to/avatar.png" />}
                </header>
                <main>
                    <AppRoutes
                        isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
                        handleLogin={handleLogin}
                        handleLogout={handleLogout}
                    />
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
