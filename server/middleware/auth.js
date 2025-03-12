const jwt = require('jsonwebtoken');
require('dotenv').config(); // Assicurati che venga caricato

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Token di autenticazione mancante' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token di autenticazione mancante' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Errore di autenticazione:', error);
        res.status(401).json({ error: 'Token non valido' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Accesso non autorizzato' });
    }
};

module.exports = { authMiddleware, isAdmin };