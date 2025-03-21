import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {  // Gestisce le azioni dell'admin nella dashboard
    const [prenotazioni, setPrenotazioni] = useState([]);
    const [filtroData, setFiltroData] = useState('');
    const [filtroCampo, setFiltroCampo] = useState('');

    useEffect(() => {
        fetchPrenotazioni();
    }, []);

    const fetchPrenotazioni = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/prenotazioni', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPrenotazioni(response.data);
        } catch (error) {
            console.error('Errore nel recupero prenotazioni:', error);
        }
    };

    const deletePrenotazione = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/prenotazioni/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPrenotazioni();
        } catch (error) {
            console.error('Errore nella cancellazione:', error);
        }
    };

    const prenotazioniFiltrate = prenotazioni
        .filter(p => !filtroData || p.data === filtroData)
        .filter(p => !filtroCampo || p.campo === filtroCampo);

    return (
        <div className="container mt-5">
            <h2>Dashboard Admin</h2>
            
            <div className="row mb-4">
                <div className="col">
                    <input
                        type="date"
                        className="form-control"
                        value={filtroData}
                        onChange={(e) => setFiltroData(e.target.value)}
                        placeholder="Filtra per data"
                    />
                </div>
                <div className="col">
                    <select
                        className="form-control"
                        value={filtroCampo}
                        onChange={(e) => setFiltroCampo(e.target.value)}
                    >
                        <option value="">Tutti i campi</option>
                        <option value="Campo 1">Campo 1</option>
                        <option value="Campo 2">Campo 2</option>
                        <option value="Campo 3">Campo 3</option>
                    </select>
                </div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Data</th>
                        <th>Ora</th>
                        <th>Campo</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {prenotazioniFiltrate.map(prenotazione => (
                        <tr key={prenotazione.id}>
                            <td>{prenotazione.nome}</td>
                            <td>{prenotazione.data}</td>
                            <td>{prenotazione.ora}</td>
                            <td>{prenotazione.campo}</td>
                            <td>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deletePrenotazione(prenotazione.id)}
                                >
                                    Elimina
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Admin;