import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function AdminDashboard() {  //gestisce la pagina della dashboard dell'admin
    const [activeTab, setActiveTab] = useState('prenotazioni');
    const [prenotazioni, setPrenotazioni] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingItem, setEditingItem] = useState(null);

    // Configura axios con il token
    const setupAxiosAuth = () => {
        const token = localStorage.getItem('token');
        if (token) {
            return {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
        }
        return {};
    };

    // Fetch Data
    const fetchPrenotazioni = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/prenotazioni', setupAxiosAuth());
            setPrenotazioni(response.data);
            setError('');
        } catch (error) {
            console.error('Errore nel caricamento delle prenotazioni:', error);
            setError('Errore nel caricamento delle prenotazioni');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/users', setupAxiosAuth());
            setUsers(response.data);
            setError('');
        } catch (error) {
            console.error('Errore nel caricamento degli utenti:', error);
            setError('Errore nel caricamento degli utenti');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'prenotazioni') {
            fetchPrenotazioni();
        } else {
            fetchUsers();
        }
    }, [activeTab]);

    // Handle Edit Prenotazione
    const handleEditPrenotazione = async (prenotazione) => {
        try {
            setError('');
            const response = await axios.put(
                `http://localhost:5000/api/prenotazioni/${prenotazione.id}`,
                {
                    data: prenotazione.data,
                    ora: prenotazione.ora,
                    campo: prenotazione.campo,
                    email: prenotazione.email
                },
                setupAxiosAuth()
            );
            setEditingItem(null);
            fetchPrenotazioni();
            console.log('Prenotazione modificata con successo:', response.data);
        } catch (error) {
            console.error('Errore nella modifica:', error.response?.data || error);
            setError(error.response?.data?.error || 'Errore nella modifica della prenotazione');
        }
    };

    // Delete handlers
    const handleDeletePrenotazione = async (id) => {
        if (window.confirm('Sei sicuro di voler eliminare questa prenotazione?')) {
            try {
                await axios.delete(`http://localhost:5000/api/prenotazioni/${id}`, setupAxiosAuth());
                fetchPrenotazioni();
                setError('');
            } catch (error) {
                setError('Errore nell\'eliminazione della prenotazione');
            }
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Sei sicuro di voler eliminare questo utente?')) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`, setupAxiosAuth());
                fetchUsers();
                setError('');
            } catch (error) {
                setError('Errore nell\'eliminazione dell\'utente');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Dashboard Amministratore</h2>
            
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {loading && (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Caricamento...</span>
                    </div>
                </div>
            )}

            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'prenotazioni' ? 'active' : ''}`}
                        onClick={() => setActiveTab('prenotazioni')}
                    >
                        Prenotazioni
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Utenti
                    </button>
                </li>
            </ul>

            {activeTab === 'prenotazioni' ? (
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Ora</th>
                                <th>Campo</th>
                                <th>Email</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prenotazioni.map(prenotazione => (
                                <tr key={prenotazione.id}>
                                    <td>
                                        {editingItem?.id === prenotazione.id ? (
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={editingItem.data}
                                                onChange={(e) => setEditingItem({
                                                    ...editingItem,
                                                    data: e.target.value
                                                })}
                                            />
                                        ) : (
                                            prenotazione.data
                                        )}
                                    </td>
                                    <td>
                                        {editingItem?.id === prenotazione.id ? (
                                            <input
                                                type="time"
                                                className="form-control"
                                                value={editingItem.ora}
                                                onChange={(e) => setEditingItem({
                                                    ...editingItem,
                                                    ora: e.target.value
                                                })}
                                            />
                                        ) : (
                                            prenotazione.ora
                                        )}
                                    </td>
                                    <td>
                                        {editingItem?.id === prenotazione.id ? (
                                            <select
                                                className="form-control"
                                                value={editingItem.campo}
                                                onChange={(e) => setEditingItem({
                                                    ...editingItem,
                                                    campo: e.target.value
                                                })}
                                            >
                                                <option value="⚽ Campo da Calcio">⚽ Campo da Calcio</option>
                                                <option value="🎾 Campo da Tennis">🎾 Campo da Tennis</option>
                                                <option value="🏀 Campo da Basket">🏀 Campo da Basket</option>
                                                <option value="🏐 Campo da Volley">🏐 Campo da Volley</option>
                                            </select>
                                        ) : (
                                            prenotazione.campo
                                        )}
                                    </td>
                                    <td>{prenotazione.email}</td>
                                    <td>
                                        {editingItem?.id === prenotazione.id ? (
                                            <>
                                                <button
                                                    className="btn btn-success btn-sm me-2"
                                                    onClick={() => handleEditPrenotazione(editingItem)}
                                                >
                                                    Salva
                                                </button>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => setEditingItem(null)}
                                                >
                                                    Annulla
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="btn btn-primary btn-sm me-2"
                                                    onClick={() => setEditingItem({...prenotazione})}
                                                >
                                                    Modifica
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDeletePrenotazione(prenotazione.id)}
                                                >
                                                    Elimina
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Ruolo</th>
                                <th>Data Registrazione</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.nome}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        {user.email !== 'admin@prenotazioni.com' && (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                Elimina
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;