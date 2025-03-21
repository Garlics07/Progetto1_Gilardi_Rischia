import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import PrenotazioneForm from './components/PrenotazioneForm';
import ComeFunziona from './pages/ComeFunziona';
import CentriSportivi from './pages/CentriSportivi';
import UserDashboard from './pages/UserDashboard';
import ChangePassword from './components/ChangePassword';
import './styles/global.css';

function App() {  // Componente principale dell'applicazione
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/come-funziona" element={<ComeFunziona />} />
                        <Route path="/centri-sportivi" element={<CentriSportivi />} />
                        <Route 
                            path="/prenotazioni" 
                            element={
                                <ProtectedRoute>
                                    <PrenotazioneForm />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/admin" 
                            element={
                                <ProtectedRoute adminOnly>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/dashboard" 
                            element={
                                <ProtectedRoute>
                                    <UserDashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/change-password" 
                            element={
                                <ProtectedRoute>
                                    <ChangePassword />
                                </ProtectedRoute>
                            } 
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
