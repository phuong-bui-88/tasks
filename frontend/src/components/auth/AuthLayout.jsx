import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Layout component for authentication pages
 */
const AuthLayout = ({ children, title }) => {
    const location = useLocation();
    const message = location.state?.message;

    return (
        <div className="max-w-md mx-auto px-4">
            <div className="mt-16 flex flex-col items-center">
                <div className="w-full bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-xl font-medium text-center mb-4">
                        {title}
                    </h1>

                    {message && (
                        <div className="mb-4 bg-green-100 p-3 rounded text-green-800">
                            {message}
                        </div>
                    )}

                    {children}
                </div>

                <div className="mt-8 text-xs text-gray-500 text-center">
                    Task Management System © {new Date().getFullYear()}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
