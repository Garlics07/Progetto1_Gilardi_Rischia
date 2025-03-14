const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../data/db.json');

const readDB = () => {
    try {
        return JSON.parse(fs.readFileSync(dbPath));
    } catch (error) {
        console.error('Errore nella lettura del DB:', error);
        return { users: [], prenotazioni: [] };
    }
};

const writeDB = (data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Errore nella scrittura del DB:', error);
        throw error;
    }
};

// Ottieni tutti gli utenti
exports.getUsers = async (req, res) => {
    try {
        const db = readDB();
        // Rimuovi le password prima di inviare i dati
        const users = db.users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        res.json(users);
    } catch (error) {
        console.error('Errore nel recupero degli utenti:', error);
        res.status(500).json({ error: 'Errore nel recupero degli utenti' });
    }
};

// Aggiorna un utente
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, role } = req.body;
        const db = readDB();
        
        const userIndex = db.users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }

        // Non permettere la modifica dell'admin principale
        if (db.users[userIndex].email === 'admin@prenotazioni.com') {
            return res.status(403).json({ error: 'Non puoi modificare l\'admin principale' });
        }

        // Mantieni la password esistente e aggiorna gli altri campi
        db.users[userIndex] = {
            ...db.users[userIndex],
            nome,
            email,
            role,
            updatedAt: new Date().toISOString()
        };

        writeDB(db);

        // Rimuovi la password prima di inviare la risposta
        const { password, ...userWithoutPassword } = db.users[userIndex];
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Errore nell\'aggiornamento dell\'utente:', error);
        res.status(500).json({ error: 'Errore nell\'aggiornamento dell\'utente' });
    }
};

// Elimina un utente
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const db = readDB();
        
        const userIndex = db.users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }

        // Non permettere l'eliminazione dell'admin principale
        if (db.users[userIndex].email === 'admin@prenotazioni.com') {
            return res.status(403).json({ error: 'Non puoi eliminare l\'admin principale' });
        }

        db.users.splice(userIndex, 1);
        writeDB(db);

        res.json({ message: 'Utente eliminato con successo' });
    } catch (error) {
        console.error('Errore nell\'eliminazione dell\'utente:', error);
        res.status(500).json({ error: 'Errore nell\'eliminazione dell\'utente' });
    }
};