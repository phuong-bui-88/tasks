import { useState } from 'react';
import './LoginPage.css'; // We'll create this CSS file

function LoginPage({ onLogin }) {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

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
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
