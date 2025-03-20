import React from 'react';

function ComeFunziona() {  //pagina statica che illustra il funzionamento dell'app 
    return (
        <div className="container mt-5">
            <h1 className="text-center">ℹ️ Come Funziona</h1>
            <p className="text-center">Scopri come prenotare un campo sportivo in pochi semplici passi.</p>

            <div className="mt-4">
                <h3>🔹 Passaggi per prenotare un campo</h3>
                <ul className="list-group">
                    <li className="list-group-item">1️⃣ Registrati o accedi al tuo account.</li>
                    <li className="list-group-item">2️⃣ Vai alla sezione "Prenotazioni" e scegli la data e l'ora.</li>
                    <li className="list-group-item">3️⃣ Seleziona il campo sportivo desiderato.</li>
                    <li className="list-group-item">4️⃣ Conferma la prenotazione e ricevi la conferma via email.</li>
                </ul>
            </div>

            <div className="mt-5">
                <h3>❓ Domande Frequenti (FAQ)</h3>

                <div className="accordion" id="faqAccordion">

                    {/* FAQ 1 */}
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                                📆 Posso modificare o cancellare una prenotazione?
                            </button>
                        </h2>
                        <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div className="accordion-body">
                                Sì, puoi modificare o cancellare la tua prenotazione entro 24 ore prima dell'orario prenotato accedendo alla tua area personale.
                            </div>
                        </div>
                    </div>

                    {/* FAQ 2 */}
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingTwo">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                                💰 Quali sono i metodi di pagamento accettati?
                            </button>
                        </h2>
                        <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div className="accordion-body">
                                Accettiamo pagamenti con carta di credito, PayPal e bonifico bancario.
                            </div>
                        </div>
                    </div>

                    {/* FAQ 3 */}
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingThree">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                                ⏳ Quanto tempo prima devo prenotare un campo?
                            </button>
                        </h2>
                        <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div className="accordion-body">
                                Ti consigliamo di prenotare almeno 48 ore prima per assicurarti la disponibilità del campo desiderato.
                            </div>
                        </div>
                    </div>

                    {/* FAQ 4 */}
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingFour">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                                👥 Posso prenotare un campo per un gruppo di persone?
                            </button>
                        </h2>
                        <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div className="accordion-body">
                                Certamente! Basta specificare il numero di giocatori al momento della prenotazione.
                            </div>
                        </div>
                    </div>

                    {/* FAQ 5 */}
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingFive">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">
                                🎾 Quali tipi di campi posso prenotare?
                            </button>
                        </h2>
                        <div id="faq5" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div className="accordion-body">
                                Puoi prenotare campi da calcio, tennis, basket, volley e padel.
                            </div>
                        </div>
                    </div>

                    {/* FAQ 6 */}
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingSix">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq6">
                                🕒 Quali sono gli orari di apertura dei campi?
                            </button>
                        </h2>
                        <div id="faq6" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div className="accordion-body">
                                I campi sono disponibili dalle 8:00 alle 22:00, 7 giorni su 7.
                            </div>
                        </div>
                    </div>

                    {/* FAQ 7 */}
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingSeven">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq7">
                                🌧️ Cosa succede se piove e non posso giocare?
                            </button>
                        </h2>
                        <div id="faq7" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div className="accordion-body">
                                In caso di maltempo, ti verrà offerto un rimborso o la possibilità di spostare la prenotazione a un'altra data.
                            </div>
                        </div>
                    </div>

                    {/* FAQ 8 */}
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingEight">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq8">
                                📍 Dove si trovano i centri sportivi?
                            </button>
                        </h2>
                        <div id="faq8" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                            <div className="accordion-body">
                                I nostri centri sportivi si trovano in diverse città. Puoi consultare la pagina "Centri Sportivi" per maggiori dettagli.
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default ComeFunziona;
   