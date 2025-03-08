import React from 'react';
import { Navigate } from 'react-router-dom';

function PublicRoute({ isLoggedIn, children }) {
    if (isLoggedIn) {
        return <Navigate to="/dashboard" />;
    }
    return children;
}

export default PublicRoute;