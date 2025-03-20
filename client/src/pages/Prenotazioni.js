import React, { useState } from 'react';
import axios from 'axios';

function Prenotazioni() {   //pagina dedicata alla creazione delle prenotazioni sull'applicazione
  const [prenotazione, setPrenotazione] = useState({
    nome: '',
    data: '',
    ora: '',
    campo: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/prenotazioni', prenotazione);
      alert('Prenotazione effettuata con successo!');
      setPrenotazione({ nome: '', data: '', ora: '', campo: '' });
    } catch (error) {
      alert('Errore durante la prenotazione');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Nuova Prenotazione</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nome"
            value={prenotazione.nome}
            onChange={(e) => setPrenotazione({...prenotazione, nome: e.target.value})}
          />
        </div>
        <div className="mb-3">
          <input
            type="date"
            className="form-control"
            value={prenotazione.data}
            onChange={(e) => setPrenotazione({...prenotazione, data: e.target.value})}
          />
        </div>
        <div className="mb-3">
          <input
            type="time"
            className="form-control"
            value={prenotazione.ora}
            onChange={(e) => setPrenotazione({...prenotazione, ora: e.target.value})}
          />
        </div>
        <div className="mb-3">
          <select 
            className="form-control"
            value={prenotazione.campo}
            onChange={(e) => setPrenotazione({...prenotazione, campo: e.target.value})}
          >
            <option value="">Seleziona un campo</option>
            <option value="Campo 1">Campo 1</option>
            <option value="Campo 2">Campo 2</option>
            <option value="Campo 3">Campo 3</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Prenota</button>
      </form>
    </div>
  );
}

export default Prenotazioni;