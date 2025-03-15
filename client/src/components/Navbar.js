import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {  //funzione per il funzionamento della Navbar
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand" to="/">Centro Sportivo</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">🏠 Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/come-funziona">❔ Come Funziona</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/centri-sportivi">🏃‍♂️ Centri Sportivi</Link>
                        </li>
                        {user && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/prenotazioni">🗓️ Prenotazioni</Link>
                            </li>
                        )}
                        {user?.role === 'admin' && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin">👑 Dashboard Admin</Link>
                            </li>
                        )}
                        {user && user.role === 'user' && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard">🙋🏻‍♂️ Dashboard</Link>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link">
                                        Benvenuto {user.nome}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className="btn btn-outline-light" 
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Registrati</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
