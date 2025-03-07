import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfileDropdown.css';

function UserProfileDropdown({ handleLogout, userName = "User" }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleProfileClick = () => {
        navigate('/profile');
        setIsOpen(false);
    };

    const onLogout = () => {
        handleLogout();
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="profile-dropdown" ref={dropdownRef}>
            <div className="profile-trigger" onClick={toggleDropdown}>
                <span className="profile-name">{userName}</span>
                <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </div>

            {isOpen && (
                <div className="dropdown-menu">
                    <div className="dropdown-item" onClick={handleProfileClick}>
                        <span className="dropdown-icon">👤</span>
                        <span>Profile Settings</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-item" onClick={onLogout}>
                        <span className="dropdown-icon">🚪</span>
                        <span>Logout</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfileDropdown;
