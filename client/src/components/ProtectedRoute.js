import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, adminOnly = false }) {  //funzione per la protezione delle rotte
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Caricamento...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;