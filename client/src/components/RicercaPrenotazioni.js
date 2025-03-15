import React, { useState } from 'react';

function RicercaPrenotazioni({ onSearch }) {  //funzione per la ricerca delle prenotazioni
    const [filtri, setFiltri] = useState({
        dataInizio: '',
        dataFine: '',
        campo: '',
        nome: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFiltri(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filtri);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3">
                <div className="col-md-3">
                    <input
                        type="date"
                        className="form-control"
                        name="dataInizio"
                        value={filtri.dataInizio}
                        onChange={handleChange}
                        placeholder="Data inizio"
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="date"
                        className="form-control"
                        name="dataFine"
                        value={filtri.dataFine}
                        onChange={handleChange}
                        placeholder="Data fine"
                    />
                </div>
                <div className="col-md-3">
                    <select
                        className="form-control"
                        name="campo"
                        value={filtri.campo}
                        onChange={handleChange}
                    >
                        <option value="">Tutti i campi</option>
                        <option value="Campo da Calcio">⚽ Campo da Calcio</option>
                        <option value="Campo da Tennis">🎾 Campo da Tennis</option>
                        <option value="Campo da Basket">🏀 Campo da Basket</option>
                        <option value="Campo da Volley">🏐 Campo da Volley</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        name="nome"
                        value={filtri.nome}
                        onChange={handleChange}
                        placeholder="Cerca per nome"
                    />
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">
                        Cerca
                    </button>
                </div>
            </div>
        </form>
    );
}

export default RicercaPrenotazioni;
