import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function UserDashboard() {  //gestisce la pagina per la dashboard dell'utente
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [prenotazioni, setPrenotazioni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingPrenotazione, setEditingPrenotazione] = useState(null);

    useEffect(() => {
        fetchPrenotazioni();
    }, []);

    const fetchPrenotazioni = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                'http://localhost:5000/api/prenotazioni',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setPrenotazioni(response.data);
            setLoading(false);
        } catch (error) {
            setError('Errore nel caricamento delle prenotazioni');
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm('Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile e comporterà la perdita di tutti i tuoi dati e prenotazioni.');
        
        if (confirmDelete) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete(
                    'http://localhost:5000/api/auth/delete-account',
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                
                // Mostra un messaggio di successo con il numero di prenotazioni eliminate
                const message = `Account eliminato con successo.\n${
                    response.data.prenotazioniEliminate > 0 
                        ? `Sono state eliminate anche ${response.data.prenotazioniEliminate} prenotazioni associate al tuo account.`
                        : 'Non erano presenti prenotazioni associate al tuo account.'
                }`;
                
                alert(message);
                
                // Effettua il logout
                logout();
                
                // Reindirizza alla pagina di registrazione
                navigate('/register');
            } catch (error) {
                setError('Errore durante l\'eliminazione dell\'account: ' + 
                    (error.response?.data?.error || 'Si è verificato un errore'));
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDeletePrenotazione = async (id) => {
        if (window.confirm('Sei sicuro di voler eliminare questa prenotazione?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(
                    `http://localhost:5000/api/prenotazioni/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                fetchPrenotazioni();
            } catch (error) {
                setError('Errore durante l\'eliminazione della prenotazione');
            }
        }
    };

    const handleEditPrenotazione = async (prenotazione) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/prenotazioni/${prenotazione.id}`,
                editingPrenotazione,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setEditingPrenotazione(null);
            fetchPrenotazioni();
        } catch (error) {
            setError('Errore durante la modifica della prenotazione');
        }
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">👤 Profilo Utente</h5>
                            <div className="mb-3">
                                <strong>Nome:</strong> {user?.nome || 'Non specificato'}
                            </div>
                            <div className="mb-3">
                                <strong>Email:</strong> {user?.email || 'Non specificata'}
                            </div>
                            <div className="mb-3">
                                <strong>Ruolo:</strong> {user?.role === 'admin' ? 'Amministratore' : 'Utente'}
                            </div>
                            <div className="d-grid gap-2">
                                <Link 
                                    to="/change-password" 
                                    className="btn btn-primary"
                                >
                                    Cambia Password
                                </Link>
                                <button 
                                    className="btn btn-danger" 
                                    onClick={handleDeleteAccount}
                                >
                                    Elimina Account
                                </button>
                                <button 
                                    className="btn btn-secondary" 
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">📅 Le Mie Prenotazioni</h5>
                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Caricamento...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger">{error}</div>
                            ) : prenotazioni.length === 0 ? (
                                <div className="alert alert-info">
                                    Non hai ancora effettuato prenotazioni
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Data</th>
                                                <th>Ora</th>
                                                <th>Campo</th>
                                                <th>Azioni</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {prenotazioni.map(prenotazione => (
                                                <tr key={prenotazione.id}>
                                                    <td>
                                                        {editingPrenotazione?.id === prenotazione.id ? (
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                value={editingPrenotazione.data}
                                                                onChange={(e) => setEditingPrenotazione({
                                                                    ...editingPrenotazione,
                                                                    data: e.target.value
                                                                })}
                                                            />
                                                        ) : prenotazione.data}
                                                    </td>
                                                    <td>
                                                        {editingPrenotazione?.id === prenotazione.id ? (
                                                            <input
                                                                type="time"
                                                                className="form-control"
                                                                value={editingPrenotazione.ora}
                                                                onChange={(e) => setEditingPrenotazione({
                                                                    ...editingPrenotazione,
                                                                    ora: e.target.value
                                                                })}
                                                            />
                                                        ) : prenotazione.ora}
                                                    </td>
                                                    <td>
                                                        {editingPrenotazione?.id === prenotazione.id ? (
                                                            <select
                                                                className="form-control"
                                                                value={editingPrenotazione.campo}
                                                                onChange={(e) => setEditingPrenotazione({
                                                                    ...editingPrenotazione,
                                                                    campo: e.target.value
                                                                })}
                                                            >
                                                                <option value="⚽ Campo da Calcio">⚽ Campo da Calcio</option>
                                                                <option value="🎾 Campo da Tennis">🎾 Campo da Tennis</option>
                                                                <option value="🏀 Campo da Basket">🏀 Campo da Basket</option>
                                                                <option value="🏐 Campo da Volley">🏐 Campo da Volley</option>
                                                            </select>
                                                        ) : prenotazione.campo}
                                                    </td>
                                                    <td>
                                                        {editingPrenotazione?.id === prenotazione.id ? (
                                                            <>
                                                                <button
                                                                    className="btn btn-success btn-sm me-2"
                                                                    onClick={() => handleEditPrenotazione(prenotazione)}
                                                                >
                                                                    Salva
                                                                </button>
                                                                <button
                                                                    className="btn btn-secondary btn-sm"
                                                                    onClick={() => setEditingPrenotazione(null)}
                                                                >
                                                                    Annulla
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    className="btn btn-primary btn-sm me-2"
                                                                    onClick={() => setEditingPrenotazione({...prenotazione})}
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;