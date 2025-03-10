import React from 'react';
import { Navigate } from 'react-router-dom';

function PublicRoute({ isLoggedIn, children }) {
    // If the user is already logged in, redirect them to the dashboard
    if (isLoggedIn) {
        return <Navigate to="/dashboard" />;
    }

    // Otherwise, render the children (login/register pages)
    return children;
}

export default PublicRoute;