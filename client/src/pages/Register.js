import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Register() {  //gestisce la pagina per la registrazione e la logica stessa
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        password: '',
        confermaPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Pulisci l'errore quando l'utente inizia a digitare
        setError('');
    };

    const validateForm = () => {
        if (!formData.nome || !formData.email || !formData.password || !formData.confermaPassword) {
            setError('Tutti i campi sono obbligatori');
            return false;
        }
        if (formData.password !== formData.confermaPassword) {
            setError('Le password non coincidono');
            return false;
        }
        if (formData.password.length < 6) {
            setError('La password deve essere di almeno 6 caratteri');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            setError('');
            
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                nome: formData.nome,
                email: formData.email,
                password: formData.password
            });

            // Salva il token e effettua il login
            if (response.data.token) {
                login(response.data.token);
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Errore durante la registrazione');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Registrazione</h2>
                            
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="nome" className="form-label">Nome Completo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nome"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="confermaPassword" className="form-label">
                                        Conferma Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confermaPassword"
                                        name="confermaPassword"
                                        value={formData.confermaPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? 'Registrazione in corso...' : 'Registrati'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;