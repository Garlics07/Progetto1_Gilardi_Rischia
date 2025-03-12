const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const authController = require('../controllers/authController');
const prenotazioniController = require('../controllers/prenotazioniController');

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Prenotazioni routes
router.get('/prenotazioni', authenticateToken, prenotazioniController.getPrenotazioni);
router.post('/prenotazioni', authenticateToken, prenotazioniController.createPrenotazione);
router.delete('/prenotazioni/:id', authenticateToken, isAdmin, prenotazioniController.deletePrenotazione);
router.get('/prenotazioni/search', authenticateToken, prenotazioniController.searchPrenotazioni);

// Admin routes
router.get('/admin/dashboard', authenticateToken, isAdmin, prenotazioniController.getDashboardData);

module.exports = router;