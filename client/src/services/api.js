import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Interceptor per aggiungere il token alle richieste
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const prenotazioniService = {  //funzioni per gestire le prenotazioni
    getAll: () => api.get('/prenotazioni'),
    create: (data) => api.post('/prenotazioni', data),
    delete: (id) => api.delete(`/prenotazioni/${id}`),
    search: (params) => api.get('/prenotazioni/search', { params })
};

export const authService = {  //funzioni per gestire l'autenticazione
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData)
};

export default api;