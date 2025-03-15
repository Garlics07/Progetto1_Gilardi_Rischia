import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrenotazioneForm() { //funzione per la creazione di una nuova prenotazione
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        data: '',
        ora: '',
        campo: '⚽ Campo da Calcio'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Genera le opzioni per gli orari in base al giorno selezionato
    const getOrariDisponibili = (data) => {
        if (!data) return [];
        
        const giorno = new Date(data).getDay() || 7; // 0 = domenica, convertiamo in 7
        const giornoSettimana = giorno === 7 ? 6 : giorno - 1; // convertiamo in 0-6 dove 0 è lunedì
        
        let inizioOrario, fineOrario;
        switch (giornoSettimana) {
            case 5: // Sabato
                inizioOrario = 9;
                fineOrario = 20;
                break;
            case 6: // Domenica
                inizioOrario = 9;
                fineOrario = 18;
                break;
            default: // Lunedì - Venerdì
                inizioOrario = 8;
                fineOrario = 22;
                break;
        }

        return Array.from({ length: fineOrario - inizioOrario }, (_, i) => {
            const ora = inizioOrario + i;
            return `${ora.toString().padStart(2, '0')}:00`;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/prenotazioni',
                {
                    ...formData,
                    email: user.email
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            navigate('/');
        } catch (error) {
            console.error('Errore nella prenotazione:', error);
            setError(error.response?.data?.error || 'Errore durante la prenotazione');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const orariDisponibili = getOrariDisponibili(formData.data);

    return (
        <div className="container mt-4">
            <h2>Nuova Prenotazione</h2>
            <p className="text-muted mb-4">Le prenotazioni hanno una durata fissa di un'ora</p>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label htmlFor="data" className="form-label">Data</label>
                    <input
                        type="date"
                        className="form-control"
                        id="data"
                        name="data"
                        value={formData.data}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="ora" className="form-label">Ora di inizio</label>
                    <select
                        className="form-control"
                        id="ora"
                        name="ora"
                        value={formData.ora}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleziona un orario</option>
                        {orariDisponibili.map(ora => (
                            <option key={ora} value={ora}>{ora}</option>
                        ))}
                    </select>
                    {formData.ora && (
                        <small className="text-muted">
                            La prenotazione terminerà alle {formData.ora.split(':')[0].padStart(2, '0')}:59
                        </small>
                    )}
                </div>

                <div className="mb-3">
                    <label htmlFor="campo" className="form-label">Campo</label>
                    <select
                        className="form-control"
                        id="campo"
                        name="campo"
                        value={formData.campo}
                        onChange={handleChange}
                        required
                    >
                        <option value="⚽ Campo da Calcio">⚽ Campo da Calcio</option>
                        <option value="🎾 Campo da Tennis">🎾 Campo da Tennis</option>
                        <option value="🏀 Campo da Basket">🏀 Campo da Basket</option>
                        <option value="🏐 Campo da Volley">🏐 Campo da Volley</option>
                    </select>
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Prenotazione in corso...' : 'Prenota'}
                </button>
            </form>
        </div>
    );
}

export default PrenotazioneForm;
