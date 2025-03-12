const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const { authMiddleware, isAdmin } = require('./middleware/auth');
require('dotenv').config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Leggi il database JSON
const readDB = () => {
    return JSON.parse(fs.readFileSync('./data/db.json'));
};

// Scrivi nel database JSON
const writeDB = (data) => {
    fs.writeFileSync('./data/db.json', JSON.stringify(data, null, 2));
};

// Rotte Controllo Auth e ricerca
const authController = require('./controllers/authController');
const prenotazioniController = require('./controllers/prenotazioniController');
const userController = require('./controllers/userController');

app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/change-password', authMiddleware, authController.changePassword);
app.delete('/api/auth/delete-account', authMiddleware, authController.deleteAccount);

// User routes
app.get('/api/users', authMiddleware, isAdmin, userController.getUsers);
app.delete('/api/users/:id', authMiddleware, isAdmin, userController.deleteUser);

// Prenotazioni routes
app.get('/api/prenotazioni/calendario', authMiddleware, prenotazioniController.getPrenotazioniCalendario);
app.get('/api/prenotazioni/search', authMiddleware, prenotazioniController.searchPrenotazioni);
app.get('/api/prenotazioni', authMiddleware, prenotazioniController.getPrenotazioni);
app.post('/api/prenotazioni', authMiddleware, prenotazioniController.createPrenotazione);
app.put('/api/prenotazioni/:id', authMiddleware, prenotazioniController.updatePrenotazione);
app.delete('/api/prenotazioni/:id', authMiddleware, prenotazioniController.deletePrenotazione);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Errore interno del server' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});