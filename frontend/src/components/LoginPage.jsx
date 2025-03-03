import { useState } from 'react';
import './LoginPage.css';
import RegisterPage from './RegisterPage'; // Import the new component

function LoginPage({ onLogin }) {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const loginSuccessful = onLogin(credentials);

        if (!loginSuccessful) {
            setError('Invalid username or password');
        }
    };

    const handleRegister = (userData) => {
        console.log('User registered:', userData);
        // 
    };

    if (isRegistering) {
        return <RegisterPage
            onRegister={handleRegister}
            onCancel={() => setIsRegistering(false)}
            error={error}
        />;
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Please sign in to continue</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <div className="input-icon-wrapper">
                            <i className="icon icon-user"></i>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Username"
                                value={credentials.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-icon-wrapper">
                            <i className="icon icon-lock"></i>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-footer">
                        <button type="submit" className="login-button">
                            Sign In
                        </button>
                        <div className="additional-options">
                            <a href="#" className="forgot-password">Forgot password?</a>
                            <button
                                type="button"
                                className="register-button"
                                onClick={() => setIsRegistering(true)}
                            >
                                Create Account
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
