// Importazione delle librerie necessarie per la gestione dei file
const fs = require('fs');
const path = require('path');

// Definizione del percorso del file database
const dbPath = path.join(__dirname, '../data/db.json');

// Funzione per leggere il database dal file JSON
const readDB = () => {
    try {
        return JSON.parse(fs.readFileSync(dbPath));
    } catch (error) {
        console.error('Errore nella lettura del DB:', error);
        return { users: [], prenotazioni: [] };
    }
};

// Funzione per salvare il database nel file JSON
const writeDB = (data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Errore nella scrittura del DB:', error);
        throw error;
    }
};

// Funzione per ottenere gli orari di apertura in base al giorno della settimana
const getOrariApertura = (giorno) => {
    // 0 = Lunedì, 6 = Domenica
    if (giorno === 5) return { inizio: 9, fine: 20 };  // Sabato
    if (giorno === 6) return { inizio: 9, fine: 18 };  // Domenica
    return { inizio: 8, fine: 22 };  // Lunedì - Venerdì
};

// Funzione per verificare se un orario è valido per una prenotazione
const isOrarioValido = (data, ora) => {
    try {
        const dataPrenotazione = new Date(data);
        const giorno = dataPrenotazione.getDay() || 7;  // Converte 0 (domenica) in 7
        const giornoSettimana = giorno === 7 ? 6 : giorno - 1;  // Converte in 0-6 dove 0 è lunedì
        
        const orari = getOrariApertura(giornoSettimana);
        const oraPrenotazione = parseInt(ora.split(':')[0]);
        
        // Verifica che l'ora sia esatta (solo XX:00)
        if (!ora.endsWith(':00')) return false;
        
        // Verifica che l'ora sia all'interno dell'orario di apertura
        return oraPrenotazione >= orari.inizio && oraPrenotazione < orari.fine;
    } catch (error) {
        console.error('Errore nella validazione dell\'orario:', error);
        return false;
    }
};

// Funzione per verificare se una data è futura
const isDataFutura = (data) => {
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    const dataPrenotazione = new Date(data);
    dataPrenotazione.setHours(0, 0, 0, 0);
    return dataPrenotazione >= oggi;
};

// Controller per ottenere tutte le prenotazioni
exports.getPrenotazioni = async (req, res) => {
    try {
        const db = readDB();
        // Se l'utente è admin, mostra tutte le prenotazioni
        if (req.user.role === 'admin') {
            return res.json(db.prenotazioni);
        }
        // Altrimenti, mostra solo le prenotazioni dell'utente loggato
        const userPrenotazioni = db.prenotazioni.filter(p => p.userId === req.user.id);
        res.json(userPrenotazioni);
    } catch (error) {
        console.error('Errore nel recupero delle prenotazioni:', error);
        res.status(500).json({ error: 'Errore nel recupero delle prenotazioni' });
    }
};

// Controller per cercare prenotazioni specifiche
exports.searchPrenotazioni = async (req, res) => {
    try {
        const { data, campo, email } = req.query;
        const db = readDB();
        let prenotazioni = db.prenotazioni;

        // Filtra le prenotazioni in base ai criteri di ricerca
        if (req.user.role !== 'admin') {
            prenotazioni = prenotazioni.filter(p => p.userId === req.user.id);
        }
        if (data) prenotazioni = prenotazioni.filter(p => p.data === data);
        if (campo) prenotazioni = prenotazioni.filter(p => p.campo.toLowerCase().includes(campo.toLowerCase()));
        if (email) prenotazioni = prenotazioni.filter(p => p.email.toLowerCase().includes(email.toLowerCase()));

        res.json(prenotazioni);
    } catch (error) {
        console.error('Errore nella ricerca delle prenotazioni:', error);
        res.status(500).json({ error: 'Errore nella ricerca delle prenotazioni' });
    }
};

// Controller per creare una nuova prenotazione
exports.createPrenotazione = async (req, res) => {
    try {
        const db = readDB();
        const { data, ora, campo, email } = req.body;

        // Validazioni
        if (!isDataFutura(data)) {
            return res.status(400).json({ error: 'Non è possibile prenotare per date passate' });
        }
        if (!isOrarioValido(data, ora)) {
            return res.status(400).json({ 
                error: 'Orario non valido. Gli orari di apertura sono:\n' +
                      '- Lunedì-Venerdì: 8:00-22:00\n' +
                      '- Sabato: 9:00-20:00\n' +
                      '- Domenica: 9:00-18:00\n' +
                      'Le prenotazioni hanno una durata di un\'ora esatta'
            });
        }
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Email non valida' });
        }

        // Crea la nuova prenotazione
        const nuovaPrenotazione = {
            id: Date.now().toString(),
            ...req.body,
            userId: req.user.id,
            email: email.toLowerCase(),
            createdAt: new Date().toISOString()
        };

        // Verifica se esiste già una prenotazione per lo stesso orario e campo
        const conflitto = db.prenotazioni.find(p => 
            p.data === nuovaPrenotazione.data && 
            p.ora === nuovaPrenotazione.ora && 
            p.campo === nuovaPrenotazione.campo
        );

        if (conflitto) {
            return res.status(400).json({ error: 'Questa fascia oraria è già occupata per il campo selezionato' });
        }

        // Salva la nuova prenotazione
        db.prenotazioni.push(nuovaPrenotazione);
        writeDB(db);
        res.status(201).json(nuovaPrenotazione);
    } catch (error) {
        console.error('Errore nella creazione della prenotazione:', error);
        res.status(500).json({ error: 'Errore nella creazione della prenotazione' });
    }
};

// Controller per aggiornare una prenotazione esistente
exports.updatePrenotazione = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, ora, campo, email } = req.body;
        const db = readDB();

        // Validazioni
        if (!isOrarioValido(data, ora)) {
            return res.status(400).json({ 
                error: 'Orario non valido. Gli orari di apertura sono:\n' +
                      '- Lunedì-Venerdì: 8:00-22:00\n' +
                      '- Sabato: 9:00-20:00\n' +
                      '- Domenica: 9:00-18:00'
            });
        }
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Email non valida' });
        }

        // Trova la prenotazione da aggiornare
        const prenotazione = db.prenotazioni.find(p => p.id === id);
        if (!prenotazione) {
            return res.status(404).json({ error: 'Prenotazione non trovata' });
        }

        // Verifica i permessi
        if (req.user.role !== 'admin' && prenotazione.userId !== req.user.id) {
            return res.status(403).json({ error: 'Non hai i permessi per modificare questa prenotazione' });
        }

        // Verifica conflitti
        const conflitto = db.prenotazioni.find(p => 
            p.id !== id &&
            p.data === data && 
            p.ora === ora && 
            p.campo === campo
        );

        if (conflitto) {
            return res.status(400).json({ error: 'Questa fascia oraria è già occupata per il campo selezionato' });
        }

        // Aggiorna la prenotazione
        const prenotazioneAggiornata = {
            ...prenotazione,
            data,
            ora,
            campo,
            email: email.toLowerCase(),
            updatedAt: new Date().toISOString()
        };

        const index = db.prenotazioni.findIndex(p => p.id === id);
        db.prenotazioni[index] = prenotazioneAggiornata;
        writeDB(db);

        res.json(prenotazioneAggiornata);
    } catch (error) {
        console.error('Errore nell\'aggiornamento della prenotazione:', error);
        res.status(500).json({ error: 'Errore nell\'aggiornamento della prenotazione' });
    }
};

// Controller per eliminare una prenotazione
exports.deletePrenotazione = async (req, res) => {
    try {
        const { id } = req.params;
        const db = readDB();
        
        // Trova la prenotazione da eliminare
        const prenotazione = db.prenotazioni.find(p => p.id === id);
        if (!prenotazione) {
            return res.status(404).json({ error: 'Prenotazione non trovata' });
        }

        // Verifica i permessi
        if (req.user.role !== 'admin' && prenotazione.userId !== req.user.id) {
            return res.status(403).json({ error: 'Non hai i permessi per eliminare questa prenotazione' });
        }

        // Elimina la prenotazione
        const index = db.prenotazioni.findIndex(p => p.id === id);
        db.prenotazioni.splice(index, 1);
        writeDB(db);

        res.json({ message: 'Prenotazione eliminata con successo' });
    } catch (error) {
        console.error('Errore nell\'eliminazione della prenotazione:', error);
        res.status(500).json({ error: 'Errore nell\'eliminazione della prenotazione' });
    }
};

// Controller per ottenere tutte le prenotazioni per il calendario
exports.getPrenotazioniCalendario = async (req, res) => {
    try {
        const db = readDB();
        // Restituisce tutte le prenotazioni senza filtrare per utente
        res.json(db.prenotazioni);
    } catch (error) {
        console.error('Errore nel recupero delle prenotazioni:', error);
        res.status(500).json({ error: 'Errore nel recupero delle prenotazioni' });
    }
};