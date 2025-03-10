import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import UserProfileDropdown from './components/users/UserProfileDropdown';
import { UserProvider, useUser } from './contexts/UserContext';
import AppRoutes from './routes/AppRoutes';

// Inner component that uses the context
function AppContent() {
    const [tasks, setTasks] = useState([]);
    const { isLoggedIn, userData, handleLogout } = useUser();

    return (
        <div className="app">
            <header className="app-header">
                <h1>Task Management App</h1>
                {isLoggedIn && (
                    <UserProfileDropdown
                        handleLogout={handleLogout}
                        userName={userData.username}
                        userAvatar="path/to/avatar.png"
                    />
                )}
            </header>
            <main>
                <AppRoutes />
            </main>
        </div>
    );
}

// Main App component that provides the context
function App() {
    return (
        <BrowserRouter>
            <UserProvider>
                <AppContent />
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;
