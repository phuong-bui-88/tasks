import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
    const [tasks, setTasks] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in (e.g., from localStorage)
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        if (loggedInStatus === 'true') {
            setIsLoggedIn(true);
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
                    {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
                </header>
                <main>
                    <AppRoutes
                        isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
                    />
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
