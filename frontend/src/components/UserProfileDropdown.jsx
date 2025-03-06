import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfileDropdown.css';

function UserProfileDropdown({ handleLogout }) {
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
                <div className="user-avatar">
                    <span>👤</span>
                </div>
                <span className="profile-name">My Profile</span>
            </div>

            {isOpen && (
                <div className="dropdown-menu">
                    <div className="dropdown-item" onClick={handleProfileClick}>
                        Profile Settings
                    </div>
                    <div className="dropdown-item" onClick={onLogout}>
                        Logout
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfileDropdown;
