const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const dbPath = path.join(__dirname, '../data/db.json');

// Funzione per leggere il database
const readDB = () => {
    try {
        if (!fs.existsSync(dbPath)) {
            const initialData = { users: [], prenotazioni: [] };
            fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
            return initialData;
        }
        return JSON.parse(fs.readFileSync(dbPath));
    } catch (error) {
        console.error('Errore nella lettura del DB:', error);
        return { users: [], prenotazioni: [] };
    }
};

// Funzione per scrivere nel database
const writeDB = (data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Errore nella scrittura del DB:', error);
    }
};

// Funzione per verificare se l'admin esiste
const checkAndCreateAdmin = async () => {
    try {
        const db = readDB();
        const adminExists = db.users.some(user => user.email === 'admin@prenotazioni.com');

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin', 10);
            const admin = {
                id: '1',
                nome: 'Amministratore',
                email: 'admin@prenotazioni.com',
                password: hashedPassword,
                role: 'admin',
                createdAt: new Date().toISOString()
            };

            db.users.push(admin);
            writeDB(db);
            console.log('Admin creato con successo');
        }
    } catch (error) {
        console.error('Errore nella verifica/creazione dell\'admin:', error);
    }
};

// Esegui il check dell'admin solo una volta all'avvio
checkAndCreateAdmin();

// Controller per la registrazione
exports.register = async (req, res) => {
    try {
        const { nome, email, password } = req.body;

        if (!nome || !email || !password) {
            return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
        }

        const db = readDB();

        if (db.users.some(user => user.email === email)) {
            return res.status(400).json({ error: 'Email già registrata' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now().toString(),
            nome,
            email,
            password: hashedPassword,
            role: 'user',
            createdAt: new Date().toISOString()
        };

        db.users.push(newUser);
        writeDB(db);

        const token = jwt.sign(
            { 
                id: newUser.id, 
                email: newUser.email, 
                role: newUser.role,
                nome: newUser.nome 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            message: 'Registrazione completata con successo',
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Errore durante la registrazione:', error);
        res.status(500).json({ error: 'Errore durante la registrazione' });
    }
};

// Controller per il login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const db = readDB();
        const user = db.users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ error: 'Credenziali non valide' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenziali non valide' });
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role,
                nome: user.nome 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Login effettuato con successo',
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Errore durante il login:', error);
        res.status(500).json({ error: 'Errore durante il login' });
    }
};

// Verifica token
exports.verifyToken = (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Token non fornito' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        res.json({ valid: true, user: verified });
    } catch (error) {
        res.status(401).json({ error: 'Token non valido' });
    }
};

// Ottieni utente corrente
exports.getCurrentUser = async (req, res) => {
    try {
        const db = readDB();
        const user = db.users.find(u => u.id === req.user.id);
        
        if (!user) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }

        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero dell\'utente' });
    }
};

// Controller per il cambio password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
        }

        const db = readDB();
        const user = db.users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }

        // Verifica la password corrente
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Password corrente non valida' });
        }

        // Aggiorna la password
        user.password = await bcrypt.hash(newPassword, 10);
        writeDB(db);

        res.json({ message: 'Password aggiornata con successo' });
    } catch (error) {
        console.error('Errore durante il cambio password:', error);
        res.status(500).json({ error: 'Errore durante il cambio password' });
    }
};

// Controller per eliminare l'account
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const db = readDB();

        // Trova l'indice dell'utente
        const userIndex = db.users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }

        // Conta le prenotazioni che verranno eliminate
        const prenotazioniUtente = db.prenotazioni.filter(p => p.userId === userId);
        const numeroPrenotazioni = prenotazioniUtente.length;

        // Rimuovi l'utente dall'array
        db.users.splice(userIndex, 1);

        // Rimuovi tutte le prenotazioni associate all'utente
        db.prenotazioni = db.prenotazioni.filter(p => p.userId !== userId);

        // Salva le modifiche
        writeDB(db);

        res.json({ 
            message: 'Account eliminato con successo', 
            prenotazioniEliminate: numeroPrenotazioni 
        });
    } catch (error) {
        console.error('Errore durante l\'eliminazione dell\'account:', error);
        res.status(500).json({ error: 'Errore durante l\'eliminazione dell\'account' });
    }
};