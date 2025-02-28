import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';

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
                    <Routes>
                        <Route
                            path="/"
                            element={isLoggedIn ? <Dashboard tasks={tasks} setTasks={setTasks} /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/login"
                            element={!isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />}
                        />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
