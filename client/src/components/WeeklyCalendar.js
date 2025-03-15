import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfWeek, addDays } from 'date-fns';
import { it } from 'date-fns/locale';

const WeeklyCalendar = () => {  //funzione per la visualizzazione del calendario settimanale
    const [prenotazioni, setPrenotazioni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentDate] = useState(new Date());

    // Funzione per ottenere gli orari in base al giorno
    const getTimeSlotsByDay = (dayIndex) => {
        // dayIndex: 0 = Lunedì, 6 = Domenica
        switch (dayIndex) {
            case 5: // Sabato
                return Array.from({ length: 12 }, (_, i) => {
                    const hour = i + 9; // 9:00 - 20:00
                    return `${hour.toString().padStart(2, '0')}:00`;
                });
            case 6: // Domenica
                return Array.from({ length: 10 }, (_, i) => {
                    const hour = i + 9; // 9:00 - 18:00
                    return `${hour.toString().padStart(2, '0')}:00`;
                });
            default: // Lunedì - Venerdì
                return Array.from({ length: 15 }, (_, i) => {
                    const hour = i + 8; // 8:00 - 22:00
                    return `${hour.toString().padStart(2, '0')}:00`;
                });
        }
    };

    // Funzione per normalizzare il formato dell'ora
    const normalizeTime = (time) => {
        if (!time) return '';
        // Rimuovi eventuali secondi e millisecondi
        const [hours, minutes] = time.split(':');
        return `${hours.padStart(2, '0')}:${minutes || '00'}`;
    };

    // Genera i giorni della settimana
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const day = addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i);
        const formattedDate = format(day, 'yyyy-MM-dd');
        console.log('Data generata:', formattedDate);
        return {
            date: day,
            formattedDate: formattedDate,
            dayName: format(day, 'EEEE', { locale: it }),
            timeSlots: getTimeSlotsByDay(i)
        };
    });

    useEffect(() => {
        fetchPrenotazioni();
    }, []);

    const fetchPrenotazioni = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/prenotazioni/calendario', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Prenotazioni ricevute:', response.data);
            setPrenotazioni(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Errore nel caricamento delle prenotazioni:', error);
            setError('Errore nel caricamento delle prenotazioni');
            setLoading(false);
        }
    };

    const getPrenotazioneForSlot = (date, time) => {
        console.log('Cercando prenotazione per:', { date, time });
        const prenotazione = prenotazioni.find(p => {
            const normalizedBookingTime = normalizeTime(p.ora);
            const normalizedSlotTime = normalizeTime(time);
            
            console.log('Confronto:', {
                data: p.data,
                dataCalendario: date,
                oraPrenotazione: p.ora,
                oraNormalizzataPrenotazione: normalizedBookingTime,
                oraSlot: time,
                oraNormalizzataSlot: normalizedSlotTime,
                match: p.data === date && normalizedBookingTime === normalizedSlotTime
            });
            
            return p.data === date && normalizedBookingTime === normalizedSlotTime;
        });
        
        if (prenotazione) {
            console.log('Prenotazione trovata:', prenotazione);
        }
        return prenotazione;
    };

    const getPrenotazioneStyle = (campo) => {
        switch(campo) {
            case '⚽ Campo da Calcio':
                return 'bg-success';
            case '🎾 Campo da Tennis':
                return 'bg-warning';
            case '🏀 Campo da Basket':
                return 'bg-danger';
            case '🏐 Campo da Volley':
                return 'bg-info';
            default:
                return 'bg-primary';
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Caricamento...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger mt-3">{error}</div>;
    }

    return (
        <div className="table-responsive">
            {prenotazioni.length === 0 && !loading && (
                <div className="alert alert-info">
                    Non ci sono prenotazioni da visualizzare
                </div>
            )}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Ora</th>
                        {weekDays.map(day => (
                            <th key={day.formattedDate} className="text-center" style={{ minWidth: '150px' }}>
                                <div className="fw-bold">{day.dayName}</div>
                                <div>{format(day.date, 'd MMMM', { locale: it })}</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 15 }, (_, i) => {
                        const hour = (i + 8).toString().padStart(2, '0') + ':00';
                        return (
                            <tr key={hour}>
                                <td className="align-middle">{hour}</td>
                                {weekDays.map(day => {
                                    // Verifica se l'ora è disponibile per questo giorno
                                    const isTimeSlotAvailable = day.timeSlots.includes(hour);
                                    if (!isTimeSlotAvailable) {
                                        return <td key={`${day.formattedDate}-${hour}`} className="bg-light text-muted text-center">Chiuso</td>;
                                    }

                                    const prenotazione = getPrenotazioneForSlot(day.formattedDate, hour);
                                    return (
                                        <td key={`${day.formattedDate}-${hour}`} className="text-center">
                                            {prenotazione ? (
                                                <div className={`p-2 rounded ${getPrenotazioneStyle(prenotazione.campo)}`}>
                                                    <small className="text-white">
                                                        {prenotazione.campo}
                                                    </small>
                                                </div>
                                            ) : (
                                                <div></div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default WeeklyCalendar; 