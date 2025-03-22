import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WeeklyCalendar from '../components/WeeklyCalendar';
import '../styles/Home.css';

function Home() {  //funzione relativa al funzionamento della homepage
    const { user } = useAuth();

    return (
        <>
            <div className="hero-section">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center">
                            <h1 className="display-3 fw-bold">Benvenuto al Centro Sportivo</h1>
                            <p className="lead fs-4">
                                Il tuo spazio per lo sport e il benessere
                            </p>
                            {!user && (
                                <div className="mt-4">
                                    <Link to="/register" className="btn btn-primary btn-lg me-3">Inizia Ora</Link>
                                    <Link to="/come-funziona" className="btn btn-outline-light btn-lg">Scopri di più</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-5">

                <div className="row mb-5">
                    <div className="col-md-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">🏟️ I Nostri Campi</h5>
                                <p className="card-text">
                                    Disponiamo di campi moderni e ben mantenuti per diverse discipline sportive:
                                </p>
                                <ul className="list-unstyled">
                                    <li>⚽ Campo da Calcio</li>
                                    <li>🎾 Campo da Tennis</li>
                                    <li>🏀 Campo da Basket</li>
                                    <li>🏐 Campo da Volley</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">⏰ Orari</h5>
                                <p className="card-text">
                                    Siamo aperti tutti i giorni:
                                </p>
                                <ul className="list-unstyled">
                                    <li>Lunedì - Venerdì: 8:00 - 22:00</li>
                                    <li>Sabato: 9:00 - 20:00</li>
                                    <li>Domenica: 9:00 - 18:00</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">📅 Prenotazioni</h5>
                                <p className="card-text">
                                    Prenota facilmente il tuo campo preferito online.
                                </p>
                                {user ? (
                                    <Link to="/prenotazioni" className="btn btn-primary">
                                        Prenota Ora
                                    </Link>
                                ) : (
                                    <div>
                                        <p className="text-muted">
                                            Effettua il login per prenotare
                                        </p>
                                        <Link to="/login" className="btn btn-primary me-2">
                                            Login
                                        </Link>
                                        <Link to="/register" className="btn btn-outline-primary">
                                            Registrati
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {user ? (
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title mb-4">📅 Calendario Settimanale</h5>
                                    <div className="calendar-legend mb-3">
                                        <div className="d-flex gap-3 justify-content-center">
                                            <div><span className="badge bg-success">⚽</span> Campo da Calcio</div>
                                            <div><span className="badge bg-warning">🎾</span> Campo da Tennis</div>
                                            <div><span className="badge bg-danger">🏀</span> Campo da Basket</div>
                                            <div><span className="badge bg-info">🏐</span> Campo da Volley</div>
                                        </div>
                                    </div>
                                    <WeeklyCalendar />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-12 text-center">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">👋 Accedi per vedere il calendario</h5>
                                    <p className="card-text">
                                        Effettua il login per visualizzare la disponibilità dei campi e prenotare le tue attività sportive.
                                    </p>
                                    <div className="mt-3">
                                        <Link to="/login" className="btn btn-primary me-2">Login</Link>
                                        <Link to="/register" className="btn btn-outline-primary">Registrati</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="container mt-5">
                <h2 className="text-center mb-4">Novità</h2>
                <div className="row mb-5">
                    <div className="col-md-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">🏆 Nuovo Torneo di Calcio</h5>
                                <p className="card-text">Iscriviti al nostro torneo di calcio che inizia il prossimo mese!</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">🎉 Offerta Speciale</h5>
                                <p className="card-text">Sconto del 20% su tutte le prenotazioni effettuate entro la fine del mese!</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">🎾 Nuovo Corso di Tennis</h5>
                                <p className="card-text">Unisciti ai nostri nuovi corsi di tennis, aperti a tutti i livelli!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
