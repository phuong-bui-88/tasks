import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed CSS import since we're using Tailwind now

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
        <div className="relative inline-block w-52 font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif]" ref={dropdownRef}>
            <div
                className="flex items-center justify-between cursor-pointer px-3 py-2.5 rounded-md w-full box-border bg-gray-50 border border-gray-200 transition-all duration-200 hover:bg-gray-200 hover:border-gray-300"
                onClick={toggleDropdown}
            >
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden overflow-ellipsis flex-grow text-gray-800">{userName}</span>
                <span className={`ml-2 text-xs transition-transform duration-300 flex-shrink-0 text-gray-500 ${isOpen ? 'transform rotate-180' : ''}`}>▼</span>
            </div>

            {isOpen && (
                <div className="absolute top-[calc(100%+5px)] right-0 bg-white shadow-lg rounded-md min-w-full w-full z-10 box-border overflow-hidden border border-gray-100 animate-dropdownFade">
                    <div
                        className="py-3 px-3.5 cursor-pointer transition-colors duration-200 flex items-center text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        onClick={handleProfileClick}
                    >
                        <span className="mr-2.5 text-base">👤</span>
                        <span>Profile Settings</span>
                    </div>
                    <div className="h-px bg-gray-200 my-1"></div>
                    <div
                        className="py-3 px-3.5 cursor-pointer transition-colors duration-200 flex items-center text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        onClick={onLogout}
                    >
                        <span className="mr-2.5 text-base">🚪</span>
                        <span>Logout</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfileDropdown;
