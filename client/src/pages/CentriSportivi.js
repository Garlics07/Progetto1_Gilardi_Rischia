import React from 'react';
import calcio from '../assets/campo-calcio.jpg';
import tennis from '../assets/campo-tennis.jpg'
import basket from '../assets/campo-basket.jpg';
import volley from '../assets/campo-volley.jpg';

function CentriSportivi() {  //pagina statica che mostra le immagini dei campi + una mappa interattiva
    return (
        <div className="container mt-5">
            <h1 className="text-center">🏟️ Centri Sportivi</h1>
            <p className="lead text-center">
                Scopri i nostri centri sportivi e trova il campo perfetto per la tua prossima partita!
            </p>

            <div className="row mt-4">
                {/* Campo da Calcio */}
                <div className="col-md-6">
                    <div className="card">
                        <img src={calcio} className="card-img-top" alt="Campo da Calcio" style={{width: '100%', height: '300px', objectFit: 'cover'}}/>
                        <div className="card-body">
                            <h5 className="card-title">⚽ Campo da Calcio</h5>
                            <p className="card-text">Un campo in erba sintetica perfetto per le tue partite.</p>
                        </div>
                    </div>
                </div>

                {/* Campo da Tennis */}
                <div className="col-md-6">
                    <div className="card">
                        <img src={tennis} className="card-img-top" alt="Campo da Tennis" style={{width: '100%', height: '300px', objectFit: 'cover'}}/>
                        <div className="card-body">
                            <h5 className="card-title">🎾 Campo da Tennis</h5>
                            <p className="card-text">Gioca su un campo in terra battuta di alta qualità.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                {/* Campo da Basket */}
                <div className="col-md-6">
                    <div className="card">
                        <img src={basket} className="card-img-top" alt="Campo da Basket" style={{width: '100%', height: '300px', objectFit: 'cover'}}/>
                        <div className="card-body">
                            <h5 className="card-title">🏀 Campo da Basket</h5>
                            <p className="card-text">Un campo regolamentare per sfide entusiasmanti.</p>
                        </div>
                    </div>
                </div>

                {/* Campo da Volley */}
                <div className="col-md-6">
                    <div className="card">
                        <img src={volley} className="card-img-top" alt="Campo da Volley" style={{width: '100%', height: '300px', objectFit: 'cover'}}/>
                        <div className="card-body">
                            <h5 className="card-title">🏐 Campo da Volley</h5>
                            <p className="card-text">Perfetto per tornei e partite tra amici.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mappa */}
            <div className="mt-5 text-center">
                <h3>📍 Dove Trovarci</h3>
                <iframe 
                    title="Mappa Centro Sportivo"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.8692401041!2d12.395912!3d41.902783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f619c3f4829bb%3A0xa4c32c364a1c060!2sRoma!5e0!3m2!1sit!2sit!4v1619000000000!5m2!1sit!2sit"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
        </div>
    );
}

export default CentriSportivi;
